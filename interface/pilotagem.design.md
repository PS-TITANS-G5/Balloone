# Tela de pilotagem móvel

Modo Impeccable: **Operate**. Plataforma: web em celular. Autoridade visual: [DESIGN.md](../DESIGN.md).

Decisões do produto: vídeo frontal e comando por toque, operação sem notebook e sem internet; identificação do Balloone e recuperação explícita de conexão.

Aplicação implementada: paisagem com duas mãos e alternativa funcional em retrato; vídeo central protagonista, controles laterais fora da imagem e PARAR destacado em vermelho. Conexão e diagnóstico são ações secundárias; estados e falhas aparecem por extenso. A referência do produto é 22:9 (2640 × 1080); a tela se adapta à janela disponível sem forçar essa proporção no stream.

## Composição e identidade

A tela usa fundo creme (#F4F1EB), texto escuro e câmera sobre preto. Os direcionais são brancos quando disponíveis, cinza quando bloqueados e dourados quando pressionados. PARAR usa vermelho Titans e texto branco. O vídeo mantém a proporção original.

O cabeçalho exibe o PNG transparente do elmo fornecido pelo grupo, em proporção original. A altura da imagem é 90 px no desktop, 75 px em telas estreitas e 70 px na paisagem compacta. Os comandos usam system-ui.

## Layout e estados

O contêiner central tem largura máxima de 1600 px e respeita safe areas. A grade de paisagem tem três colunas: giro, câmera, movimento/PARAR. Abaixo de 700 px, a câmera ocupa a primeira linha e os comandos ficam abaixo em duas colunas. Em paisagem de até 550 px de altura, reduz-se o espaçamento e retiram-se dicas auxiliares para manter os comandos completos.

A escala de espaçamento usa 4, 8, 12, 16, 24 e 32 px. Direcionais e PARAR têm cantos de 6 px e a câmera tem cantos de 8 px; ações secundárias e campos, 8 px. Botões gerais têm altura mínima de 44 px; direcionais usam 64–104 px na composição principal, 60 px na paisagem baixa e 78 px em retrato. PARAR usa 60 px, ou 52 px na paisagem baixa. Esses valores são decisões desta tela, não derivados dos mínimos da logo.

O foco visível usa contorno dourado de 3 px. Estados desabilitados, pressionados e falhas combinam aparência e texto. Transições de cor duram 120 ms e são omitidas com preferência por movimento reduzido. Não há animação contínua na área de pilotagem.

A tela inicial apresenta o estado da sessão no cabeçalho. Mensagens operacionais aparecem durante a conexão, a pilotagem e em caso de falha. O diagnóstico reúne as métricas de confirmação.

A câmera mostra estado vazio antes da sessão, solicitação do stream e recuperação explícita em erro. Soltar ou cancelar o controle solicita STOP; perda de foco, ocultação da página e redimensionamento também interrompem o comando. Abertura dos painéis bloqueia movimento. Reconexão exige nova parada inicial confirmada e novo gesto; nenhuma interrupção retoma movimento automaticamente. Desconectar é encerramento da sessão, não desligamento elétrico.

## Evidência e pendências

A validação automatizada e as oito capturas estão registradas em [VALIDACAO.md](VALIDACAO.md). Não houve overflow horizontal nas larguras 320, 390, 880, 1440 e 2640 px. As capturas em VALIDACAO.md registram a revisão anterior.
