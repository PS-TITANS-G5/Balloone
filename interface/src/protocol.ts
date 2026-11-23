export type Command = 'STOP' | 'FWD' | 'BACK' | 'LEFT' | 'RIGHT';
export function parseAck(value: unknown) {
  if (typeof value !== 'string') return null;
  const match = /^ACK:(\d{1,10}):(\d{1,10}):(STOP|FWD|BACK|LEFT|RIGHT)$/.exec(value);
  if (!match || Number(match[1]) > 0xffffffff || Number(match[2]) > 0xffffffff) return null;
  return { sequence: Number(match[1]), command: match[3] as Command };
}
export function validHost(host: string) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) && host.split('.').every(part => Number(part) <= 255);
}
export const protocolErrors: Record<string, string> = {
  'ERR:FORMAT': 'Formato recusado pelo robô. Confira a versão do firmware.',
  'ERR:AUTH_OR_FORMAT': 'Token recusado. Confira o token configurado no firmware.',
  'ERR:BUSY': 'Robô ocupado. Desconecte o outro controlador e tente novamente.',
  'ERR:SEQ': 'Sequência recusada. Conecte novamente para iniciar outra sessão.',
  'ERR:CMD': 'Comando recusado. Confira a versão do firmware.',
  'ERR:STALE': 'Comando antigo recusado. Conecte novamente.',
  'ERR:NEED_STOP': 'O robô exige uma nova parada inicial. Conecte novamente.'
};
