import { readFile } from 'node:fs/promises';
import { expect, test, type Page, type WebSocketRoute } from '@playwright/test';

const token = 'token-de-teste';
const streamUrl = /^http:\/\/192\.168\.4\.1\/stream\?/;

async function openConnection(page: Page) {
  const commands: string[] = [];
  let robot!: WebSocketRoute;
  await page.routeWebSocket(/^ws:\/\/192\.168\.4\.1:81\/?$/, socket => {
    robot = socket;
    socket.onMessage(message => commands.push(message.toString()));
  });
  await page.route(streamUrl, route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"/>',
  }));
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('/');
  await page.clock.pauseAt(new Date('2026-01-01T01:00:00Z'));
  await page.getByRole('button', { name: 'Conexão', exact: true }).click();
  await page.getByLabel('Token de controle').fill(token);
  await page.getByRole('button', { name: 'Conectar', exact: true }).click();

  await expect.poll(() => commands).toEqual([`${token},1,STOP`]);
  return { commands, robot };
}

test('libera o controle após o ACK inicial, solicita vídeo e para ao soltar', async ({ page }) => {
  const { commands, robot } = await openConnection(page);
  const forward = page.getByRole('button', { name: 'Frente, manter pressionado' });
  await expect(forward).toBeDisabled();

  const videoRequest = page.waitForRequest(streamUrl);
  robot.send('ACK:1:0:STOP');
  await expect(forward).toBeEnabled();
  expect((await videoRequest).method()).toBe('GET');

  await forward.hover();
  await page.mouse.down();
  await expect.poll(() => commands.at(-1)).toBe(`${token},2,FWD`);
  await page.clock.runFor(100);
  await expect.poll(() => commands.at(-1)).toBe(`${token},3,FWD`);
  await page.mouse.up();
  await expect.poll(() => commands.at(-1)).toBe(`${token},4,STOP`);
});

test('informa a recusa do token e mantém o movimento bloqueado', async ({ page }) => {
  const { robot } = await openConnection(page);
  robot.send('ERR:AUTH_OR_FORMAT');

  await expect(page.getByRole('alert')).toContainText('Token recusado');
  await expect(page.getByRole('button', { name: 'Frente, manter pressionado' })).toBeDisabled();
});

test('bloqueia o controle se os ACKs deixam de chegar', async ({ page }) => {
  const { commands, robot } = await openConnection(page);
  const forward = page.getByRole('button', { name: 'Frente, manter pressionado' });
  robot.send('ACK:1:0:STOP');
  await expect(forward).toBeEnabled();
  await page.keyboard.down('ArrowUp');
  await expect.poll(() => commands.at(-1)).toBe(`${token},2,FWD`);

  await page.clock.runFor(400);
  await expect(page.getByText('Falha de conexão', { exact: true })).toBeVisible();
  await expect(forward).toBeDisabled();
  await page.keyboard.up('ArrowUp');
});

test('exporta sequência, comando e RTT em CSV', async ({ page }) => {
  const { robot } = await openConnection(page);
  await page.clock.runFor(25);
  robot.send('ACK:1:0:STOP');
  await expect(page.getByText('Controle pronto', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Diagnóstico' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar CSV' }).click();

  const csv = await download;
  expect(csv.suggestedFilename()).toBe('balloone-rtt.csv');
  expect(await readFile(await csv.path(), 'utf8')).toBe('sequence,command,rtt_ms\r\n1,STOP,25.00');
});
