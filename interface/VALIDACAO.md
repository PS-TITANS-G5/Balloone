# Validação da primeira interface

Registro da entrega de 9 de novembro de 2026. Escopo: UI de bancada em TypeScript/Vite, identidade Titans existente, vídeo central e controles laterais em paisagem, alternativa em retrato, PARAR e conexão secundária. Os requisitos históricos em `requisitos-e-stack.md` permanecem como referência; este registro não os substitui.

## Execução registrada

Ambiente: Node.js 24.19.0 e Chromium 158.0.8127.18. `npm run build` passou e `npm test` concluiu com **18 testes aprovados**. Os testes simulam WebSocket e eventos de ponteiro; não representam motores, rádio, câmera real ou toque físico. Comandos de instalação e execução estão no [README.md](README.md).

Foram verificadas as larguras 320, 390, 880, 1440 e 2640 px, sem overflow horizontal. Em paisagem 880 × 360 px, restam 6 px de rolagem vertical no rodapé; os comandos ficam inteiros. O enquadramento 2640 × 1080 cobre a referência 22:9 do produto.

Capturas da revisão:

| Captura | Evidência |
|---|---|
| [desktop](../.impeccable/review/desktop.png) | Composição desktop |
| [mobile](../.impeccable/review/mobile.png) | Retrato móvel |
| [landscape](../.impeccable/review/landscape.png) | Paisagem baixa |
| [user-2640](../.impeccable/review/user-2640.png) | Referência 2640 × 1080 |
| [small](../.impeccable/review/small.png) | Janela estreita |
| [validation](../.impeccable/review/validation.png) | Validação do formulário |
| [connected](../.impeccable/review/connected.png) | Sessão simulada pronta |
| [diagnostics](../.impeccable/review/diagnostics.png) | Diagnóstico da sessão simulada |

O detector visual foi executado uma vez. O apontamento de `src` ausente corresponde à imagem de vídeo intencionalmente oculta até iniciar uma sessão; não se solicita câmera antes disso. O apontamento de hierarquia tipográfica plana é falso positivo da leitura de CSS importado separadamente: H1 tem 24 px e o H3 do estado vazio varia entre 18 e 28 px.

As razões de contraste calculadas pelas cores de origem são: branco/PARAR `#C72612`, 5,65:1; preto/ação `#D0830F`, 6,94:1; texto secundário `#E5BDB7`/fundo `#1A0001`, 11,77:1; texto secundário/vinho `#560204`, 8,74:1; branco/vinho, 14,93:1. Esses pares superam 4,5:1 para texto comum; a medição não constitui auditoria completa de acessibilidade.

## Coerência e comportamento

Os tokens Titans existentes são importados no CSS; os oito valores oficiais e as regras de marca não foram alterados. Tipografia de sistema, ícones SVG locais Material Symbols e ausência de dependências remotas permitem execução offline após servir os assets. A origem e a licença dos ícones acompanham `public/icons/`. Sem logo oficial disponível, a identificação usa somente texto.

Movimento exige sessão pronta, parada inicial confirmada e painéis fechados. Interrupções solicitam STOP e exigem novo gesto. Comando solicitado e confirmado são apresentados separadamente. Desconectar tenta enviar STOP e fecha a sessão; não representa corte de alimentação. O cliente envia heartbeat a cada 100 ms, supervisiona ACK com limite provisório de 350 ms e limita a abertura da conexão a 4 s.

O CSV contém sequência, comando e RTT dos últimos 200 ACK, sem token ou outras credenciais. RTT não é latência unidirecional; ACK não confirma deslocamento físico. A câmera informa solicitação/erro, sem alegar medição de FPS ou detecção de congelamento.
