# Interface

Tela do piloto, com o vídeo e os comandos, incluindo a parte da comunicação do lado da interface.

A identidade oficial está em [DESIGN.md](../DESIGN.md), com a [paleta Titans](paleta-titans.md), [tokens CSS](titans-tokens.css) e [direção da tela móvel](pilotagem.design.md). Os valores vêm do manual e substituem as aproximações anteriores; os tokens agora são carregados pela interface.

Em [análise dos requisitos e proposta de stack](requisitos-e-stack.md), tem-se o protótipo inicial do firmware, lacunas do protótipo e plano de validação para o edital.

## Executar a interface

A primeira implementação usa TypeScript e Vite. Requer Node.js 22.12.0 ou mais recente e foi validada com Node.js 24.19.0. Execute os comandos abaixo na raiz do repositório, onde fica o `package-lock.json` do workspace:

```sh
npm ci
npm run dev
```

Abra o endereço HTTP informado pelo Vite. Para gerar os arquivos estáticos em `interface/dist/`, use `npm run build`. Para executar a suíte Playwright, use `npm test` com Chromium disponível; em uma instalação nova, `npx playwright install chromium` provisiona o navegador. A instalação de dependências e do navegador pode exigir internet. A interface compilada usa recursos locais, sem CDN, fontes remotas ou serviços externos.

O servidor de desenvolvimento escuta apenas `127.0.0.1`. Para uma futura verificação pelo celular na mesma rede do computador, `npm run dev -- --host 0.0.0.0` expõe o servidor nessa rede. O firmware ainda não hospeda os assets desta interface; compilar não implanta na ESP32.

## Pilotagem de bancada

Entre no Wi-Fi do robô, abra **Conexão** e informe o IPv4 e o token configurado no firmware. A interface usa `ws://<IP>:81` para comandos e `http://<IP>/stream` para MJPEG. Use HTTP na rede local: a tela recusa iniciar uma sessão a partir de HTTPS. Não há token padrão embutido na UI.

A sessão começa com STOP e só libera movimento após seu ACK correspondente. Segure uma direção para mover e solte para solicitar STOP; PARAR permanece disponível. Setas/WASD e ativação pelo teclado são auxiliares ao desenvolvimento. Abrir conexão ou diagnóstico bloqueia movimento. Cancelamento de ponteiro, perda de foco, ocultação da página e mudança de tamanho solicitam parada; uma interrupção não retoma o movimento automaticamente. **Desconectar** encerra a sessão e tenta enviar STOP; não desliga a alimentação do robô.

O heartbeat envia comandos a cada 100 ms. A supervisão de ACK do cliente usa 350 ms e a abertura da conexão tem prazo de 4 s. Esses parâmetros são provisórios e precisam de validação com a placa. ACK confirma o comando no firmware, não a execução física. O diagnóstico exporta apenas sequência, comando e RTT dos últimos 200 ACK, sem credenciais; não mede FPS nem congelamento do vídeo.

Os ícones Material Symbols têm SVGs locais em `public/icons/`, com origem e licença registradas ali. O cabeçalho usa o elmo Titans fornecido pelo grupo, com fundo transparente e proporções originais.

Resultados e limites estão em [VALIDACAO.md](VALIDACAO.md). Esta entrega continua sendo um protótipo de bancada com motores simulados, sem atestado de prontidão para arena ou segurança física.
