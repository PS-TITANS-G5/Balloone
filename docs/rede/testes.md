# Plano de validação da comunicação de rede — Balloone G5

Este roteiro descreve **o que é possível verificar com o firmware e a interface atuais**. Os testes de bancada ainda precisam ser executados e documentados na placa; não há medições reais incluídas neste arquivo.

**Código de referência:** `firmware/balloone/balloone.ino` e `interface/`. Anote a revisão do repositório usada no ensaio.

## Situação e limites

- O robô cria o AP `BALLOONE_G5` em `192.168.4.1`, canal Wi-Fi **6**, com até um aparelho associado.
- A interface envia `token,sequência,comando` por WebSocket na porta **81** a cada aproximadamente **100 ms**. O firmware envia `ACK:sequência:milissegundos:comando` ou `ERR:...`.
- O vídeo MJPEG é solicitado de `http://192.168.4.1/stream`, na porta **80**. A interface **não mede FPS nem detecta automaticamente o congelamento do vídeo**.
- O RTT é exibido como **mediana, p95 e quantidade de amostras**. Em **Diagnóstico → Exportar CSV**, o arquivo `balloone-rtt.csv` contém sequência, comando e RTT em milissegundos dos últimos **200 ACK**, sem credenciais.
- Os motores continuam **simulados** por mensagens na serial. Nenhum teste atual comprova parada física dos motores.
- O esquemático de 17/11 coloca o **LED de conexão no IO2**. O firmware ainda precisa acionar esse LED e a ponte H, que usa IO13, IO14, IO32 e IO33.

## Preparação

1. Confira a revisão do firmware e o esquemático com a equipe de eletrônica. **Mantenha os motores desconectados** neste ensaio de rede.
2. Grave o firmware pelo PlatformIO, abra o monitor serial a **115200 baud** e anote o hash do commit testado.
3. Use Node.js 22.12.0 ou mais recente. Na raiz do repositório, com internet, execute `npm ci`. Depois, execute `npm run dev`, conecte o notebook ao Wi-Fi `BALLOONE_G5` e abra [http://127.0.0.1:5173](http://127.0.0.1:5173). Em **Conexão**, confira o IP `192.168.4.1`, preencha o token do firmware (`balloone` por padrão) e clique em **Conectar**.
4. Registre operador, data, distância, canal 6, redes próximas, navegador/versão e se o vídeo está ativado.
5. Inicie cada cenário com uma nova sessão para limpar as amostras anteriores. Exporte o CSV de RTT antes de reconectar e use `docs/rede/registro-testes.csv` para registrar o resumo e as condições do ensaio.

## Ensaios previstos

| ID | Procedimento | O que verificar e registrar |
| --- | --- | --- |
| R01 | Ligar/resetar a ESP32-CAM sem abrir a interface | AP disponível, `IP=192.168.4.1` na serial; sistema sem comando de movimento. O LED IO2 ainda não é controlado por software. |
| R02 | Conectar com token correto e usar as quatro direções; soltar o botão/tecla | A interface envia `STOP` inicial; os comandos têm resposta `ACK`; a serial mostra `MOTOR_SIMULADO=...` quando o comando muda. |
| R03 | Usar um cliente WebSocket de teste para enviar comando antes de `STOP`, token incorreto, sequência repetida e mensagens inválidas | Respostas de erro previstas: `ERR:NEED_STOP`, `ERR:AUTH_OR_FORMAT`, `ERR:STALE`, `ERR:FORMAT`, `ERR:SEQ` e/ou `ERR:CMD`. Salve as mensagens enviadas e recebidas. |
| R04 | Abrir uma segunda aba conectada ao WebSocket enquanto a primeira detém a sessão | A segunda sessão não deve assumir o controle; verificar `ERR:BUSY`. O limite de um aparelho associado ao AP não impede várias abas no mesmo notebook. |
| R05 | Bloquear a requisição de `/stream` nas ferramentas de desenvolvimento do navegador e enviar comandos até receber pelo menos 100 confirmações | Registrar RTT mediana, p95 e quantidade de amostras. Exportar o CSV de RTT no painel **Diagnóstico**. |
| R06 | Desbloquear `/stream`, iniciar nova sessão e repetir a medição com vídeo, mantendo distância e canal | Exportar o CSV de RTT e comparar com R05. Verificar o vídeo visualmente e, se necessário, medir FPS por ferramenta externa, identificando o método. |
| R07 | Durante a sessão, interromper o Wi-Fi ou deixar de enviar comandos | Verificar parada **simulada** e encerramento. Se o timeout de 350 ms ocorrer, procurar `FAILSAFE_TIMEOUT` na serial; uma desconexão WebSocket pode encerrar a sessão sem essa mensagem. |
| R08 | Restaurar o Wi-Fi e clicar novamente em **Conectar** | **Reconexão manual**; no novo WebSocket, conferir envio inicial de `STOP` antes de qualquer movimento simulado. Medir o tempo manualmente se necessário. |
| R09 | Soltar botão/toque, cancelar ponteiro, soltar tecla, trocar janela ou ocultar a página | Verificar envio de `STOP` nas ações suportadas. **Escape não tem tratamento próprio** na versão atual. |
| R10 | Observar vídeo e WebSocket em sessão prolongada; interromper a imagem se o ambiente permitir | Registrar visualmente ausência/congelamento de vídeo. A interface **não gera alerta automático após 2 segundos**; manter o comando em `STOP` quando não houver imagem confiável. |
| R11 | Com alimentação desligada, desconectar temporariamente a câmera; religar em bancada | Verificar `CAMERA_ERROR` se a inicialização falhar. Investigar se AP e WebSocket continuam disponíveis; registrar o resultado efetivo. |
| R12 | Repetir ensaios com outros APs/robôs ativos por perto | Registrar redes próximas, perdas, RTT e qualidade aparente do vídeo. **O canal do firmware está fixado em 6**; testar outros canais requer alteração e aprovação separadas. |
| R13 | Manter sessão com vídeo/comandos por até 15 minutos, em bancada | Registrar resets, perdas, amostras de RTT e observações de aquecimento/alimentação. A interface retém só as 200 amostras de RTT mais recentes. |
| R14 | Após futura integração da ponte H e supervisão física | Ensaiar parada real, perda de comunicação e segurança com rodas suspensas, sob responsabilidade conjunta de firmware e eletrônica; **não marcar como validado hoje**. |

## Como registrar resultados

O arquivo `registro-testes.csv` é o registro manual dos ensaios. Adicione uma linha por execução com os valores observados e guarde o `balloone-rtt.csv` como evidência das amostras individuais de RTT. Deixe em branco os campos sem medição e explique o motivo em `observacoes`.

- **RTT:** é o tempo até a resposta do firmware, não o atraso da câmera nem o tempo até movimento das rodas.
- **Timeout:** `350 ms` é o valor configurado no firmware; não representa, por si só, medição física de parada.
- **Canais:** não declarar testes em 1 ou 11 enquanto o firmware permanecer fixo no canal 6.
- **Repetibilidade:** compare cenários mantendo distância, alimentação, navegador e padrão de comandos equivalentes.
- **Segurança:** não concluir que motores, LED ou parada de emergência estão homologados com base em logs simulados.

## Pendências de integração

| Área | Pendência real |
| --- | --- |
| Redes | Executar R01–R13 na placa, registrar medidas e justificar topologia/canal. |
| Firmware/eletrônica | Confirmar no hardware a pinagem **IO2 do LED** e a ponte H; implementar acionamento real e mecanismo independente de parada antes do ensaio físico R14. |
| Interface | Avaliar medição de FPS e reconexão automática com o grupo. |
| Grupo | Validar canal e topologia para múltiplos robôs durante a competição. |
