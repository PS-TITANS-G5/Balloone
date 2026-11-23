import './styles.css';
import { Connection, type Phase } from './connection';
import { bindControls } from './controls';
import { validHost } from './protocol';

const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const host = element<HTMLInputElement>('host');
const token = element<HTMLInputElement>('token');
const panel = element('connection-panel');
const diagnostics = element('diagnostics');
const video = element<HTMLImageElement>('video');
const guidance = element('guidance');
const settings = element<HTMLButtonElement>('settings');
const connectButton = element<HTMLButtonElement>('connect');
const formError = element('form-error');
const directionButtons = document.querySelectorAll<HTMLButtonElement>('[data-cmd]');
const rttFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const connection = new Connection(render);
const phases: Record<Phase, string> = { disconnected: 'Desconectado', connecting: 'Conectando…', authenticating: 'Validando conexão…', ready: 'Controle pronto', fault: 'Falha de conexão' };
let previousPhase: Phase = 'disconnected';
let videoState: 'inactive' | 'requested' | 'error' = 'inactive';
let activeHost = validHost(location.hostname) && !location.hostname.startsWith('127.') ? location.hostname : '192.168.4.1';
host.value = activeHost;
const panelsClosed = () => panel.hidden && diagnostics.hidden;
const canMove = () => connection.phase === 'ready' && panelsClosed() && !document.hidden;
const halt = bindControls(canMove, command => connection.move(command), () => connection.stop());

function togglePanel(open: boolean) {
  halt();
  panel.hidden = !open;
  settings.setAttribute('aria-expanded', String(open));
  render();
  if (open) host.focus();
}
function requestVideo() {
  videoState = 'requested';
  video.hidden = false;
  video.src = `http://${activeHost}/stream?session=${Date.now()}`;
  renderVideo();
}
function renderVideo() {
  const offline = videoState === 'inactive';
  const failed = videoState === 'error';
  element('video-status').textContent = offline ? 'Inativa' : failed ? 'Indisponível' : 'Stream solicitado';
  element('video-empty').hidden = !offline && !failed;
  element('video-title').textContent = failed ? 'Câmera indisponível' : 'Câmera em espera';
  element('video-message').textContent = failed ? 'Confira a câmera e tente novamente. O canal de controle é independente.' : 'Conecte ao robô para solicitar a câmera e habilitar os comandos.';
  element('video-action').textContent = failed ? 'Tentar câmera novamente' : 'Configurar conexão';
}
function updateSession(phase: Phase) {
  if (phase === previousPhase) return;

  const wasReady = previousPhase === 'ready';
  previousPhase = phase;
  if (phase === 'ready') {
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus();
    requestVideo();
  } else if (phase === 'disconnected' || phase === 'fault') {
    videoState = 'inactive';
    video.removeAttribute('src');
    video.hidden = true;
    renderVideo();
    if (wasReady) halt();
  }
}

function render() {
  const { phase, message, requested } = connection;
  updateSession(phase);

  document.body.dataset.state = phase;
  element('status').textContent = phases[phase];
  guidance.parentElement!.hidden = phase === 'disconnected';
  guidance.textContent = phase === 'ready' && !panelsClosed()
    ? 'Movimento bloqueado. Feche os painéis de conexão e diagnóstico para pilotar.'
    : message;

  if (phase === 'fault' && !panel.hidden) formError.textContent = message;
  const connecting = phase === 'connecting' || phase === 'authenticating';
  connectButton.disabled = host.disabled = token.disabled = connecting || phase === 'ready';
  connectButton.textContent = connecting ? 'Conectando…' : 'Conectar';
  element<HTMLButtonElement>('disconnect').disabled = phase === 'disconnected' || phase === 'fault';

  const movementEnabled = canMove();
  for (const button of directionButtons) {
    button.disabled = !movementEnabled;
    button.dataset.held = String(movementEnabled && button.dataset.cmd === requested);
  }

  element('robot-host').textContent = activeHost;
  renderDiagnostics();
}

function renderDiagnostics() {
  const sorted = connection.samples.map(sample => sample.rtt).sort((a, b) => a - b);
  const percentile = (p: number) => sorted.length ? `${rttFormat.format(sorted[Math.ceil(p * sorted.length) - 1])} ms` : '-';
  element('median').textContent = percentile(.5);
  element('p95').textContent = percentile(.95);
  element('sample-count').textContent = String(sorted.length);
  element('ack-age').textContent = connection.phase === 'ready' ? `${Math.round(performance.now() - connection.lastAck)} ms` : '-';
  element('drops').textContent = String(connection.drops);
  element<HTMLButtonElement>('export').disabled = !sorted.length;
}

settings.addEventListener('click', () => togglePanel(Boolean(panel.hidden)));
element('video-action').addEventListener('click', () => videoState === 'error' ? requestVideo() : togglePanel(true));
video.addEventListener('error', () => {
  if (videoState !== 'requested') return;
  videoState = 'error'; video.hidden = true; renderVideo();
});
element('connection-form').addEventListener('submit', event => {
  event.preventDefault();
  if (['connecting', 'authenticating', 'ready'].includes(connection.phase)) return;
  const ip = host.value.trim();
  const validIp = validHost(ip);
  const validToken = /^[\x21-\x2B\x2D-\x7E]{1,64}$/.test(token.value);
  host.setAttribute('aria-invalid', String(!validIp));
  token.setAttribute('aria-invalid', String(!validToken));
  if (!validIp) {
    formError.textContent = 'Informe um IPv4 válido, com quatro números de 0 a 255.';
    host.focus();
    return;
  }
  if (!validToken) {
    formError.textContent = 'Informe o token do firmware, com até 64 caracteres ASCII, sem espaços ou vírgulas.';
    token.focus();
    return;
  }
  if (location.protocol === 'https:') {
    formError.textContent = 'Abra esta interface por HTTP na rede local do robô para conectar.';
    return;
  }
  formError.textContent = '';
  activeHost = ip;
  halt();
  connection.connect(activeHost, token.value);
});
element('disconnect').addEventListener('click', () => { halt(); connection.disconnect(); settings.focus(); });
element('diagnostics-toggle').addEventListener('click', () => {
  halt(); diagnostics.hidden = !diagnostics.hidden;
  element('diagnostics-toggle').setAttribute('aria-expanded', String(!diagnostics.hidden));
  render();
  if (!diagnostics.hidden) diagnostics.scrollIntoView({ block: 'nearest' });
});
element('export').addEventListener('click', () => {
  const csv = ['sequence,command,rtt_ms', ...connection.samples.map(sample => `${sample.sequence},${sample.command},${sample.rtt.toFixed(2)}`)].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'balloone-rtt.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
renderVideo();
