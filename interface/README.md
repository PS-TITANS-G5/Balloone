# Interface de pilotagem

A interface roda no navegador do notebook e usa TypeScript, Vite e recursos locais. Requer Node.js 22.12.0 ou mais recente.

## Rodar no notebook

Na raiz do repositório, com internet, instale as dependências e inicie o servidor:

```sh
npm ci
npm run dev
```

Com o servidor rodando, conecte o notebook ao Wi-Fi `BALLOONE_G5` (senha `123456789`) e abra [http://127.0.0.1:5173](http://127.0.0.1:5173). Em **Conexão**, mantenha o IP `192.168.4.1`, digite o token do firmware (`balloone` por padrão) e clique em **Conectar**.

## Pilotagem e diagnóstico

- A interface envia `token,sequência,comando` por WebSocket na porta 81 a cada 100 ms. O movimento é liberado após o `ACK` do `STOP` inicial. O vídeo MJPEG vem de `/stream` na porta 80.
- Segure um direcional ou use as setas/WASD. Soltar o controle, abrir um painel ou perder o foco solicita `STOP`. **PARAR** também solicita `STOP`. A reconexão é manual.
- Em **Diagnóstico → Exportar CSV**, salve a sequência, o comando e o RTT dos últimos 200 ACK. Os motores ainda são simulados na serial. Para ensaios na placa, siga o [plano de validação de rede](../docs/rede/testes.md).

## Compilar e testar

Na raiz do repositório, `npm run build` gera os arquivos estáticos em `interface/dist/`. Para os testes de navegador, instale o Chromium com `npx playwright install chromium` e execute `npm test`. A suíte usa um WebSocket simulado.

## Proposta para a competição

Pilotar pelo celular com a interface hospedada na ESP32-CAM é uma proposta para decisão do grupo no Notion. Hoje, o servidor da interface roda no notebook e a placa serve o vídeo.
