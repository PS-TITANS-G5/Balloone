import { parseAck, protocolErrors, type Command } from './protocol';

export type Phase = 'disconnected' | 'connecting' | 'authenticating' | 'ready' | 'fault';
export type Sample = { sequence: number; command: Command; rtt: number };
export class Connection {
  phase: Phase = 'disconnected';
  requested: Command = 'STOP';
  message = '';
  samples: Sample[] = [];
  lastAck = 0;
  drops = 0;
  private socket: WebSocket | null = null;
  private sequence = 0;
  private ackSequence = 0;
  private token = '';
  private pending = new Map<number, { time: number; command: Command }>();
  private heartbeat: ReturnType<typeof setInterval> | undefined;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  // Local supervision, provisional: validate with the board alongside its 350 ms watchdog.
  static readonly ACK_TIMEOUT = 350;
  constructor(private changed: () => void) {}

  connect(host: string, token: string) {
    this.disconnect();
    this.phase = 'connecting';
    this.message = 'Abrindo conexão com o robô…';
    this.samples = [];
    this.lastAck = 0;
    this.sequence = this.ackSequence = 0;
    this.token = token;
    this.changed();
    let socket: WebSocket;
    try { socket = new WebSocket(`ws://${host}:81`); }
    catch { this.fail('Não foi possível abrir a conexão. Acesse a interface por HTTP na rede do robô.'); return; }
    this.socket = socket;
    this.timeout = setTimeout(() => this.fail('O robô não respondeu. Confira o Wi-Fi e o IP e tente novamente.'), 4000);
    socket.onopen = () => {
      if (this.socket !== socket) return;
      clearTimeout(this.timeout);
      this.phase = 'authenticating';
      this.message = 'Validando o token e a parada inicial…';
      this.transmit('STOP');
      if (this.socket !== socket) return;
      this.timeout = setTimeout(() => this.fail('Parada inicial sem confirmação. Confira o token e reconecte.'), Connection.ACK_TIMEOUT);
      this.heartbeat = setInterval(() => {
        if (this.phase === 'ready' && performance.now() - this.lastAck > Connection.ACK_TIMEOUT) {
          this.fail('Confirmação atrasada. Controle bloqueado; reconecte para continuar.');
          return;
        }
        this.transmit(this.phase === 'ready' ? this.requested : 'STOP');
        this.changed();
      }, 100);
      this.changed();
    };
    socket.onmessage = event => {
      if (this.socket !== socket) return;
      if (typeof event.data === 'string' && event.data.startsWith('ERR:')) {
        this.fail(protocolErrors[event.data] ?? 'O robô recusou a sessão. Confira o firmware e reconecte.');
        return;
      }
      const ack = parseAck(event.data);
      if (!ack) { this.fail('Resposta inválida do robô. Confira o firmware e reconecte.'); return; }
      const pending = this.pending.get(ack.sequence);
      if (!pending || pending.command !== ack.command || ack.sequence <= this.ackSequence) return;
      const now = performance.now();
      if (now - pending.time > Connection.ACK_TIMEOUT) { this.fail('Confirmação atrasada. Controle bloqueado; reconecte para continuar.'); return; }
      if (this.phase === 'authenticating' && (ack.sequence !== 1 || ack.command !== 'STOP')) return;
      this.lastAck = now;
      this.ackSequence = ack.sequence;
      this.samples.push({ sequence: ack.sequence, command: ack.command, rtt: now - pending.time });
      if (this.samples.length > 200) this.samples.shift();
      for (const sequence of this.pending.keys()) if (sequence <= ack.sequence) this.pending.delete(sequence);
      if (this.phase === 'authenticating') {
        clearTimeout(this.timeout);
        this.phase = 'ready';
        this.message = 'Controle pronto. Mantenha uma direção pressionada para mover.';
      }
      this.changed();
    };
    socket.onclose = () => { if (this.socket === socket) this.fail('Conexão perdida. Confira o Wi-Fi do robô e reconecte.'); };
    socket.onerror = () => { if (this.socket === socket) this.fail('Falha de conexão. Confira o Wi-Fi, o IP e tente novamente.'); };
  }

  move(command: Command) {
    if (this.phase !== 'ready') return;
    if (performance.now() - this.lastAck > Connection.ACK_TIMEOUT) { this.fail('Confirmação atrasada. Reconecte para continuar.'); return; }
    this.requested = command;
    this.transmit(command);
    this.changed();
  }
  stop() {
    this.requested = 'STOP';
    if (this.phase === 'ready' || this.phase === 'authenticating') this.transmit('STOP');
    this.changed();
  }
  disconnect() {
    this.end();
    this.phase = 'disconnected';
    this.message = '';
    this.changed();
  }
  private transmit(command: Command) {
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (socket.bufferedAmount > 0 || this.sequence >= 0xffffffff) {
      this.fail('Envio congestionado ou sessão esgotada. Controle bloqueado; reconecte.'); return;
    }
    const sequence = ++this.sequence;
    this.pending.set(sequence, { time: performance.now(), command });
    if (this.pending.size > 20) { this.fail('Comandos sem confirmação. Reconecte para continuar.'); return; }
    try { socket.send(`${this.token},${sequence},${command}`); }
    catch { this.fail('Envio interrompido. Confira a conexão e tente novamente.'); }
  }
  private fail(message: string) {
    this.drops++;
    this.end();
    this.phase = 'fault';
    this.message = message;
    this.changed();
  }
  private end() {
    clearInterval(this.heartbeat);
    clearTimeout(this.timeout);
    const socket = this.socket;
    this.socket = null;
    if (socket) {
      socket.onopen = socket.onmessage = socket.onclose = socket.onerror = null;
      if (socket.readyState === WebSocket.OPEN && socket.bufferedAmount === 0 && this.sequence < 0xffffffff) {
        try { socket.send(`${this.token},${++this.sequence},STOP`); } catch { /* Already unavailable. */ }
      }
      socket.close();
    }
    this.pending.clear();
    this.requested = 'STOP';
    this.token = '';
  }
}
