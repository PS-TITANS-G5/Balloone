# Interface do Balloone: requisitos e proposta de stack

Análise em 03/11/2026, revisada para operação pelo celular conforme decisão do responsável pela interface. Proposta para discussão da equipe; não representa implementação nem validação em hardware.

## 1. Stack Tecnológica

Adoção de **TypeScript + Vite + HTML/CSS**, com **WebSocket nativo para comandos** e **MJPEG em `<img>` para vídeo**, executados no navegador do celular ou tablet do piloto. Usar **Playwright** para testar os fluxos de controle com um robô simulado e realizar os ensaios físicos separadamente.

Essa stack atende ao escopo da interface sem exigir servidor de aplicação, banco de dados ou internet durante a operação. O firmware continua responsável pelos motores, câmera e parada por ausência de comandos.

## 2. Fontes e precedência

- Sobre o edital:
- [Requisitos gerais](../docs/requisitos.md): síntese existente do edital.
- [Rede atual](../docs/rede/README.md), [firmware](../firmware/balloone/balloone.ino) e [interface atual](index.html): contrato e implementação encontrados.
- [Fluxos do PC1](../docs/fluxos-funcionamento.pdf) e [estudo de rede](../docs/rede/estudo.pdf): contexto histórico e propostas, não evidência de funcionalidades concluídas.
- [Registro de testes](../docs/rede/registro-testes.csv): contém apenas cabeçalho na revisão consultada.

## 3. O que o edital implica para a interface

| Natureza | Requisito ou critério | Consequência para seu trabalho | Fonte |
|---|---|---|---|
| Obrigatório | Controle remoto com frente, trás, esquerda e direita | Disponibilizar as quatro direções e integrá-las ao firmware | §7, pp. 17–18; RF01–05 |
| Obrigatório | Visualizar a câmera frontal durante a operação | Vídeo utilizável para dirigir até alvos fora da visão direta | §8.1–8.2, p. 18; RF07–08 |
| Obrigatório | Comunicação suficientemente estável | Tratar falhas e comprovar operação integrada | §7 e §12; RNF12, RNF18 |
| Preferencial | Reunir vídeo, comandos, identificação e informações relevantes | Uma tela de pilotagem é a opção recomendada | §9, p. 19 |
| Critério de avaliação | Clareza, usabilidade, estabilidade e adequação à competição | Leitura rápida, controles previsíveis e estados explícitos | §9, p. 19 |
| Critério de avaliação | Latência, FPS, resolução, travamentos, recursos e instabilidade | Medir e documentar; distinguir configuração de resultado medido | §8.3, p. 18 |
| Obrigatório | Escolher e justificar arquitetura/protocolos; documentar fluxos | Registrar decisões, alternativas e integração | §13.1–13.2, pp. 25–26 |
| Obrigatório | Testes de integração antes da competição | Produzir evidências de funcionamento e falhas | §12, p. 24 |
| Recomendado quando possível | Testes adversos | Ensaiar alcance, interferência e perdas independentes dos canais | §13.3, p. 26 |
| Entrega | Interface, fonte, documentação e relatório | Instruções reproduzíveis e resultados reais | §14–15, pp. 26–27 |

Não há framework obrigatório, resolução mínima, FPS mínimo ou teto numérico de latência no edital. Os atuais 100 ms e 350 ms são parâmetros do projeto, não critérios impostos pela organização.

### Regras da disputa úteis ao operador

- Um operador por robô (§4.2).
- Três rounds de até 15 minutos; o terceiro é de batalha direta (§5.1).
- Balão azul da arena: 1 ponto; vermelho da arena: 2; balão adversário: 4 (§5.3).
- Balão próprio estourado: interromper participação e retornar apenas após substituição, no mesmo ponto de retirada (§5.4).
- Locais dos alvos não são conhecidos previamente (§5.2).

Cronômetro, lembrete de pontuação e botão de pausa para reposição são opcionais. Caso implementados, serão auxiliares manuais: o firmware não informa pontuação, estado do balão ou horário oficial. Reconhecimento de balões, mapa e navegação autônoma não são exigências.

## 4. Contrato de integração encontrado no código

| Dado | Valor atual / implicação |
|---|---|
| Placa | Freenove ESP32-WROVER-DEV v1.6 com OV2640 |
| Topologia | ESP32 em modo AP; celular conectado diretamente (dispositivo definido pelo responsável pela interface) |
| SSID | `BALLOONE_G5` |
| IP padrão | `192.168.4.1`; manter configurável na interface |
| Canal / clientes | Canal 6; AP configurado para um aparelho |
| Controle | `ws://192.168.4.1:81` |
| Mensagem enviada | `TOKEN,SEQ,CMD`, sem espaços |
| Comandos | `FWD`, `BACK`, `LEFT`, `RIGHT`, `STOP` |
| Confirmação | `ACK:SEQ:MILLIS:CMD`; `MILLIS` é o relógio do ESP32 |
| Erros | `ERR:FORMAT`, `ERR:AUTH_OR_FORMAT`, `ERR:BUSY`, `ERR:SEQ`, `ERR:CMD`, `ERR:STALE`, `ERR:NEED_STOP` |
| Sequência | Inteiro de 32 bits; aumentar por mensagem; reiniciar em nova sessão |
| Início | Primeiro comando autenticado deve ser `STOP` |
| Repetição | Comando atual a cada 100 ms, além das mudanças de comando |
| Timeout | Mais de 350 ms sem comando válido: firmware solicita parada e desconecta |
| Vídeo | `http://192.168.4.1/stream`, multipart MJPEG |
| Configuração de imagem | QVGA, 320×240, qualidade JPEG 16, um framebuffer |
| Cadência | Espera de 70 ms entre envios; cerca de 14 FPS é teto aproximado, não medição |

Senha de AP e token padrão estão no código/documentação de rede. São parâmetros de bancada. Não incluir token nos logs/exportações nem confundir autenticação de comando com identidade verificada do robô. O stream não exige token.

O ACK confirma aplicação lógica do comando; hoje `applyMotor()` apenas atualiza estado e imprime no serial. Portanto **ACK não comprova movimento nem parada física**. Também não calcular latência de uma via subtraindo `MILLIS` de um relógio do celular: os relógios não estão sincronizados.

### Dados disponíveis para exibir agora

- IP configurado, rótulo local “Balloone G5”, estado do socket e erros de protocolo.
- Comando solicitado e último comando confirmado, exibidos separadamente.
- RTT usando relógio monotônico local entre envio e ACK: mediana, p95 e quantidade de amostras.
- Tempo desde último ACK e contagem de desconexões, a implementar no cliente.
- Vídeo solicitado/inativo; FPS e congelamento permanecem sem medição no `<img>` atual.

### Dados que ainda não existem no protocolo

Identidade retornada pelo robô, versão de firmware, bateria, RSSI, velocidade real, confirmação física dos motores, estado do LED, estado do balão e métricas de quadros. Não apresentar valores fictícios. Se desejados, negociar uma extensão versionada com firmware; não enviar novas mensagens ao parser atual.

## 5. Lacunas concretas do protótipo

1. **Liberação antes da autenticação:** `onopen` já define `ready=true`. Na evolução, liberar movimento somente após ACK correspondente ao `STOP` inicial.
2. **Parar não limpa todas as entradas:** o botão central muda `pointerCmd`, mas não limpa `pressed`; ao soltá-lo, uma tecla mantida pode retomar o movimento. Fazer STOP prevalecer e exigir nova ação para voltar a andar.
3. **Teclas e ponteiro concorrentes:** definir política única, incluindo múltiplos toques, perda de captura e comandos conflitantes. Preservar o comportamento conservador de STOP em ambiguidade.
4. **Falta supervisão de ACK:** socket aberto não garante controle saudável. Detectar ACK ausente/atrasado, bloquear novos movimentos e indicar falha. Negociar os limites após medir; não tratar o timer do navegador como relógio de tempo real.
5. **Falta controle da fila de envio:** monitorar `bufferedAmount` e não acumular movimentos antigos. Ao detectar congestionamento, bloquear movimento e invalidar sessão; a parada deve continuar protegida no firmware.
6. **Estado do vídeo incompleto:** ao fechar socket, a imagem é removida, mas `videoStatus` não é atualizado nesse caminho. Monitorar controle e vídeo separadamente.
7. **Reconexão manual:** manter inicialmente um botão claro; qualquer reconexão futura deve limpar entradas e começar em STOP, sem retomar comando anterior.
8. **Validação de IP superficial:** a expressão atual aceita octetos acima de 255. Validar endereço e parâmetros antes da conexão.
9. **Instrumentação incompleta:** RTT existe, mas não há exportação nem medição de FPS/latência visual. O CSV não possui resultados.
10. **Integração física pendente:** motores e LED de conexão não estão implementados. O timeout de software não resolve sozinho travamento do microcontrolador; alinhar essa proteção com firmware/eletrônica.

Esses itens são observações estáticas do código. Nenhum ensaio de placa ou navegador foi executado nesta análise.

## 6. Justificativa da stack

| Camada | Escolha | Motivo |
|---|---|---|
| Aplicação | TypeScript, HTML semântico e CSS local | Uma tela; tipar comandos, estados e mensagens reduz erros de integração |
| Build | Vite, template vanilla-ts | Modularização e geração de arquivos estáticos; sem servidor de aplicação obrigatório |
| Tipagem | `tsc --noEmit` | Verificação explícita dos tipos como parte da validação |
| Controle | API WebSocket nativa | Compatível com o servidor já existente; Socket.IO não é substituto direto |
| Vídeo inicial | `<img>` consumindo MJPEG | Aproveita o stream atual com baixa complexidade |
| Estado | Módulo TypeScript com transições explícitas | Desconectado → conectando → autenticando → pronto → falha |
| Entrada | Pointer Events | Toque como entrada principal, com cancelamento e prioridade de parada; teclado apenas para desenvolvimento |
| Métricas | `performance.now()`, buffer limitado, exportação CSV | Reutiliza RTT e produz evidência para relatório |
| Testes de interface | Playwright com WebSocket simulado | Exercitar ACK, erros, foco, desconexão e reconexão sem depender da placa |
| Execução | Build estático hospedado na ESP32, acessado por HTTP no celular | Sem notebook ou internet na arena; requer implementar hospedagem no firmware |

Vite gera um build estático; sua documentação descreve o fluxo de build e publicação. Playwright permite interceptar/simular WebSockets. Referências: [Vite](https://vite.dev/guide/), [build estático](https://vite.dev/guide/static-deploy), [Playwright](https://playwright.dev/docs/mock).


### Execução offline e navegador

Preparar dependências e build no computador de desenvolvimento; incluir fontes, ícones e estilos no pacote e incorporá-lo ao firmware (assets embutidos ou filesystem, conforme espaço disponível). Na arena, conectar o celular ao AP do robô e abrir a interface no navegador normal. Não será necessário notebook, servidor no celular ou acesso à internet. A escolha do celular foi informada pelo responsável pela interface por mobilidade e praticidade em ambiente externo; não implica garantia de resistência à água do aparelho ou do robô.

Não assumir que publicar em HTTPS permite acessar `ws://` e `http://` do robô: há restrições de conteúdo misto e políticas/permissões de acesso à rede local que devem ser testadas no navegador escolhido. Não basear a entrega em desativar proteções do navegador. Referência: [cliente WebSocket e conteúdo misto](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications).

O firmware atual só registra `/stream`; a hospedagem da interface ainda precisa ser implementada. Para preservar os endpoints atuais, propor inicialmente servidor de assets em `http://192.168.4.1:8080/`, vídeo na porta 80 e WebSocket na 81. A porta 8080 é uma proposta, não um recurso disponível. Usar instância/tarefa HTTP separada, com porta de controle interna distinta, e verificar memória e concorrência. O handler atual de vídeo permanece em laço durante o stream; simplesmente adicionar assets ao mesmo servidor pode bloquear requisições enquanto ele transmite. Alternativa: refatorar o stream para tratamento assíncrono. Referência: [servidor HTTP da Espressif](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_server.html).

Derivar o host do robô de `location.hostname` quando a aplicação for servida pela placa; manter configuração manual para desenvolvimento. A diferença de portas não exige CORS para simplesmente exibir MJPEG em `<img>`, mas leitura via `fetch` ou pixels em canvas exige tratamento de origem. Validar os três endpoints no aparelho real.

Não depender de instalação como PWA, tela cheia ou bloqueio automático da suspensão para a primeira entrega. Em HTTP no IP privado do robô, não pressupor APIs que exigem contexto seguro. Em particular, Screen Wake Lock exige contexto seguro; preparar e testar a configuração de tempo de tela do aparelho antes do round. Referência: [Screen Wake Lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API).

### Operação por toque

- Priorizar uso em paisagem com as duas mãos, mantendo alternativa funcional em retrato; vídeo visível sem ser coberto pelos dedos.
- Começar com direcional de quatro comandos discretos e STOP destacado. Joystick virtual só se trouxer benefício em teste; o protocolo atual não aceita intensidade, diagonais ou velocidade proporcional.
- Movimento apenas enquanto o toque válido estiver mantido. Em `pointerup`, `pointercancel` ou perda de captura, limpar intenção e enviar STOP quando possível. Rastrear `pointerId`; não deixar um segundo dedo substituir silenciosamente o primeiro. Referência: [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
- Reservar `touch-action: none` à região dos controles. Definir prioridade de STOP sobre qualquer toque e exigir novo gesto para retomar.
- Ao ocultar a página, bloquear a tela, trocar de aplicativo ou perder a sessão: limpar entradas; tentar STOP quando o navegador ainda permitir e contar com timeout no robô. O evento final e o envio não são garantidos se o sistema suspender o navegador.
- Usar alvos de toque grandes e separados, rótulos legíveis ao ar livre e estados que não dependam somente de cor. Validar também com a capa usada na competição.
- Testar permanência no Wi-Fi sem internet, dados móveis ativos, chamadas/notificações, rotação e retorno à página. Voltar ao primeiro plano nunca deve retomar movimento automaticamente.

### Vídeo e métricas: evolução controlada

Manter MJPEG em `<img>` no primeiro marco. Não usar eventos de carregamento da imagem como contador confiável de quadros. Para medir quadros recebidos, uma etapa posterior pode usar `fetch` com leitura multipart e renderização em canvas, exigindo CORS no firmware ou proxy local. Descartar quadros obsoletos e limitar memória; medir o custo antes de adotar.

Contagem no firmware mede produção/envio, não exibição. FPS recebido, FPS desenhado e atraso visual são métricas distintas. Medir atraso ponta a ponta filmando um cronômetro real e sua imagem na interface. MJPEG também pode acumular atraso no transporte: imagens independentes não garantem baixa latência.

Para comandos, `bufferedAmount` informa bytes ainda enfileirados no navegador: [referência MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount). Não permite retirar mensagens já enviadas nem substitui o timeout do robô.

## 7. Escopo e organização sugeridos

Priorizar vídeo frontal, identificação/configuração do robô, conexão, quatro direções, STOP e estado confirmado de controle. Deixar diagnóstico detalhado em uma área secundária, sem esconder falhas do operador.

Estrutura proposta, ainda não criada:

```text
interface/
  index.html
  src/
    main.ts
    protocol.ts       # comandos, parser de ACK/ERR e sequência
    connection.ts     # socket, autenticação, heartbeat e supervisão
    controls.ts       # teclado, ponteiro e prioridade de STOP
    state.ts          # transições da sessão
    video.ts          # stream e estados conhecidos
    metrics.ts        # RTT, eventos e CSV sem credenciais
    styles.css
  tests/
    control.spec.ts
    recovery.spec.ts
```

Responsabilidade da interface: intenção do piloto, apresentação, sessão, envio e diagnóstico. Responsabilidade do firmware: validação dos comandos, exclusividade do controlador, motores, câmera, LED e timeout. Responsabilidade compartilhada: protocolo, política de recuperação, métricas e ensaios. Não acrescentar controle de velocidade ou botão de disparo: o contrato atual não os suporta.

## 8. Validação e sequência de entrega

| Etapa | Entrega | Evidência de aceite |
|---|---|---|
| 1 | Modularizar preservando protocolo e vídeo | Mesmas mensagens aceitas pelo firmware; operação offline |
| 2 | Corrigir sessão e prioridade de STOP | Sem movimento antes do ACK inicial; parar limpa entradas; reconexão exige nova ação |
| 3 | Testar falhas com simulador | Token errado, ocupado, ACK ausente, perda de foco/captura, múltiplos toques e socket encerrado |
| 4 | Integrar placa e motores | Quatro direções corretas; parada física medida; câmera e motores simultâneos |
| 5 | Medir desempenho | Pelo menos 100 comandos com e sem vídeo, como já proposto em rede; RTT mediana/p95, perdas, vídeo e recuperação registrados |
| 6 | Ensaiar competição | Sessões de 15 min, redes concorrentes e navegação por câmera; preparar operação pelos três rounds |
| 7 | Documentar entrega | Arquitetura, execução, versões, testes, limitações, imagens e justificativas |

O teste automatizado deve conferir mensagens e bloqueios observáveis, não apenas textos na tela. Ensaiar STOP com toque mantido, múltiplos dedos, cancelamento de toque, troca de aplicativo, bloqueio de tela, rotação, retorno à página e reconexão. Emulação móvel no Playwright não substitui ensaio no celular real; registrar modelo, sistema e navegador. Teclado permanece um recurso auxiliar de desenvolvimento. Testar perda de vídeo com controle ativo e perda de controle com vídeo ativo separadamente. Simulação não prova resposta dos motores.

Usar o CSV existente para registrar ambiente e resultados; sugerir campos adicionais para atraso visual, navegador e versão da interface quando houver medições. Definir metas numéricas após a linha de base, claramente como decisões da equipe. O timeout de 350 ms precisa ser validado fisicamente, não apenas reproduzido em um teste de interface.

Prazos do edital: PC2 em **23/11/2026 às 10h**, relatório até **04/12/2026**, competição em **05/12/2026 às 10h**. Como planejamento proposto, levar ao PC2 a interface modular e os primeiros registros de integração; reservar o período seguinte para ensaios prolongados, correções e relatório.
