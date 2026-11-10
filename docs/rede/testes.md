# Plano de validação de rede

Este plano fecha a entrega de software com um roteiro reproduzível para a placa. Os ensaios abaixo estão **pendentes nesta revisão**. Não preencher o registro com resultados dos simuladores como se fossem medições da ESP32.

## Preparação

1. Grave a revisão em teste e registre seu commit em `observacoes`, além da versão informada no INFO.
2. Confira alimentação, câmera e LED com eletrônica. Comece com motores desconectados; o firmware de rede atual só os simula.
3. Conecte um notebook ao AP. Abra a interface e o monitor serial a 115200 baud. Registre operador, canal, distância, posição do robô, redes próximas e navegador/versão.
4. Use **Iniciar nova medição** para cada cenário. Exporte ao final, confira os campos e guarde a evidência (log serial, vídeo ou captura) com referência em observações.

## Ensaios

| ID | Procedimento | Resultado esperado / o que registrar |
| --- | --- | --- |
| R01 | Ligar/resetar sem abrir a interface | AP disponível, LED de sessão apagado, comando simulado STOP; nenhum movimento na futura integração |
| R02 | Conectar com token correto, comandar as quatro direções e soltar | Primeiro comando STOP; ACK correspondente a cada direção; LED aceso; soltar envia STOP |
| R03 | Tentar movimento antes do primeiro STOP, token errado, sequência repetida/menor e mensagem malformada usando cliente WebSocket de teste | `NEED_STOP`, `AUTH_OR_FORMAT`, `STALE`, `FORMAT`/`SEQ`/`CMD`; não adquirir controle nem renovar timeout com erro |
| R04 | Com o controle ativo, abrir outra aba da interface no mesmo notebook | Segunda aba recebe `ERR:BUSY`; primeira continua operando. Um segundo aparelho é recusado pelo limite de associação do AP |
| R05 | Sem vídeo, obter pelo menos 100 ACKs durante comandos e paradas | Exportar n, mediana e p95 de RTT; anotar quedas e distância. FPS fica vazio |
| R06 | Repetir R05 com vídeo e a mesma distância/canal | Pelo menos 100 ACKs; comparar RTT e medir FPS/travamentos; registrar impacto do vídeo |
| R07 | Durante um comando, desligar o Wi-Fi do notebook ou afastá-lo até perder conexão | `FAILSAFE_TIMEOUT` na serial, STOP simulado e LED apagado. Medir o atraso real na placa; timeout configurado de 350 ms é apenas referência inicial |
| R08 | Restaurar o Wi-Fi e manter uma tecla pressionada durante a recuperação | Reconectar automaticamente em STOP; tecla mantida/auto-repeat não retoma movimento; exigir soltar e pressionar de novo. Registrar tempo de reconexão |
| R09 | Soltar mouse/toque fora do botão, cancelar toque, trocar janela, ocultar/voltar à página e usar Escape | STOP em cada caso; página oculta suspende conexão/reconexão; ao voltar, STOP confirmado antes de liberar controle |
| R10 | Interromper apenas a transmissão de vídeo em servidor de teste, preservando WebSocket | Aviso após 2 s sem imagem, recuperação do vídeo; comando STOP disponível. Não conduzir pela câmera durante falha |
| R11 | Testar boot sem câmera conectada, com alimentação desligada ao alterar a ligação | `CAMERA_ERROR`/vídeo indisponível, AP e controle continuam disponíveis; sem inferir estado dos motores a partir do vídeo |
| R12 | Repetir R06 com outros robôs/APs ativos, comparando canais 1, 6 e 11 | Registrar quantidade/redes, disposição, RSSI se medido, RTT, FPS, travamentos, perdas e alcance; justificar canal escolhido |
| R13 | Manter vídeo e controle por 15 min, duração máxima de um round | Registrar resets, perdas, FPS e RTT; confirmar estabilidade térmica/alimentação com eletrônica |
| R14 | Após integração física, repetir partida, direções, corte físico e perda de controle com rodas suspensas | Eletrônica valida parada real, watchdog independente, polaridade e LEDs; só então avaliar liberação para arena |

R03/R04 exercitam a exclusividade de **sessão**; o limite de um aparelho Wi-Fi não impede múltiplas abas no mesmo aparelho. Anexe a sequência exata de mensagens utilizada no cliente de teste.

## Leitura dos resultados

- O edital não fixa FPS, resolução ou latência mínimos. Os parâmetros atuais (100 ms / 350 ms / QVGA) são escolhas iniciais e devem ser ajustados com evidência e alinhamento com eletrônica.
- Compare R05/R06 e os canais mantendo distância, alimentação e comandos equivalentes. Um teste isolado sem interferência não representa a arena.
- RTT não mede movimento nem atraso da câmera. Para latência de vídeo, filme a cena e a tela com um cronômetro comum no enquadramento; registre o método e a diferença observada.
- `parada_timeout_ms` requer medição física ou de sinal na integração. Não copie automaticamente 350 para esse campo. Logs de software demonstram a mudança de estado simulada, sem comprovar corte de potência.
- No CSV automático, `reconexao_ms` é mediana e o RTT mantém até 10000 amostras. Se o ensaio ultrapassar esse limite, registre que o RTT descreve a janela mais recente.
- Qualquer movimento sem nova ação após reconexão, tomada de sessão por segundo cliente, ausência de STOP ou reinício sob carga exige correção antes do ensaio seguinte.

## Responsabilidades para fechamento físico

| Área | Evidência necessária |
| --- | --- |
| Redes | R01–R13 documentados, canal justificado e comparação com/sem vídeo |
| Firmware/eletrônica | IO15 e boot conferidos; motores e supervisão de parada integrados; medição real de timeout |
| Interface | Navegador do piloto validado com acesso à rede local, comandos, vídeo, avisos e exportação |
| Grupo | Canais/topologia confirmados para a competição e resultado da integração R14 |
