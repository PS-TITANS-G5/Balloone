import type { Command } from './protocol';

const keyboardCommands: Partial<Record<string, Command>> = {
  ArrowUp: 'FWD', w: 'FWD',
  ArrowDown: 'BACK', s: 'BACK',
  ArrowLeft: 'LEFT', a: 'LEFT',
  ArrowRight: 'RIGHT', d: 'RIGHT',
};

function normalizedKey(key: string) {
  return key.length === 1 ? key.toLowerCase() : key;
}

export function bindControls(canMove: () => boolean, move: (command: Command) => void, stop: () => void) {
  const pointers = new Set<number>();
  const keys = new Set<string>();
  let locked = false;
  let activePointer: number | null = null;
  function halt() {
    activePointer = null;
    locked = pointers.size > 0 || keys.size > 0;
    stop();
  }

  function unlockWhenReleased() {
    if (!pointers.size && !keys.size) locked = false;
  }

  function releasePointer(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return;
    if (event.type !== 'pointerup' || activePointer === event.pointerId) halt();
    pointers.delete(event.pointerId);
    unlockWhenReleased();
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-cmd]')) {
    button.addEventListener('contextmenu', event => event.preventDefault());
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      if (event.button !== 0 || !canMove()) return;
      pointers.add(event.pointerId);
      button.setPointerCapture(event.pointerId);
      if (locked || pointers.size !== 1 || keys.size) { halt(); return; }
      activePointer = event.pointerId;
      move(button.dataset.cmd as Command);
    });
    button.addEventListener('lostpointercapture', releasePointer);
  }
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  const stopButton = document.getElementById('stop')!;
  stopButton.addEventListener('pointerdown', event => { event.preventDefault(); halt(); });
  stopButton.addEventListener('click', halt);
  window.addEventListener('keydown', event => {
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
    const focusedCommand = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-cmd]')?.dataset.cmd as Command | undefined;
    if (event.code === 'Space' && !(event.target as HTMLElement).closest('button')) { event.preventDefault(); halt(); return; }
    const key = normalizedKey(event.key);
    const command = key === 'Enter' || key === ' ' ? focusedCommand : keyboardCommands[key];
    if (!command) return;
    event.preventDefault();
    if (event.repeat || keys.has(key)) return;
    keys.add(key);
    if (!canMove() || locked || keys.size !== 1 || pointers.size) { halt(); return; }
    move(command);
  });
  window.addEventListener('keyup', event => {
    const key = normalizedKey(event.key);
    if (!keys.has(key)) return;
    halt();
    keys.delete(key);
    unlockWhenReleased();
  });
  const interrupted = () => { halt(); pointers.clear(); keys.clear(); locked = false; };
  window.addEventListener('blur', interrupted);
  window.addEventListener('pagehide', interrupted);
  window.addEventListener('resize', halt);
  document.addEventListener('visibilitychange', () => { if (document.hidden) interrupted(); });
  return halt;
}
