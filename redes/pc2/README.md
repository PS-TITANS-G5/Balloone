# Balloone G5 — PC2, revisão de segurança (Wi-Fi puro)

**Estado:** versão PC2 atualizada após orientação dos organizadores para utilizar Wi-Fi. Revisão estática; NÃO compilado em ESP32 nem testado em hardware. Motores simulados, sem GPIO de acionamento. Não usar com motores energizados. A alternativa BLE+Wi-Fi do PC1 foi descartada do escopo atual após recomendação dos organizadores pelo Wi-Fi.

## Correções incluídas
- Token de controle configurável e senha WPA2 do AP, ambos com placeholders que impedem inicialização normal até troca. **Token em texto claro no WebSocket dentro da rede local**: não equivale a autenticação criptográfica nem impede interceptação por alguém já conectado. Vídeo MJPEG sem autenticação; não expor a redes externas.
- Uma sessão de controle por vez, adquirida somente com `STOP` autenticado. Rejeita sequência duplicada, antiga, fora do limite uint32 e comandos inválidos. Após timeout/desconexão, a sessão e o contador reiniciam.
- Timeout de 350 ms verificado antes do processamento do WebSocket; STOP simulado em perda de comandos. **Não é watchdog independente nem parada física garantida**: para operar motores reais é obrigatória supervisão de segurança local independente do servidor de rede.
- Interface reinicializa estados, sequências e medições ao conectar/desconectar, controla teclas pressionadas, trata perda de foco e mostra mediana e p95 do RTT de aplicação.
- Vídeo tem indicação de solicitação/erro de conexão, mas o elemento HTML `img` MJPEG não permite medição confiável de FPS/congelamento. **Monitoramento de vídeo não implementado.**

## Configuração e execução
1. Confirmar **AI Thinker ESP32-CAM** e a pinagem real. Instalar Arduino ESP32 core 3.x e `WebSockets by Markus Sattler`.
2. No sketch, definir `BALLOONE_AP_PASSWORD` e `BALLOONE_CONTROL_TOKEN` com valores próprios fortes (sem vírgulas no token), alterando as macros ou passando defines de compilação. Não compartilhar credenciais no repositório.
3. Compilar e gravar, alimentar de forma estável, abrir Serial 115200. Se mostrar `CONFIG_INSEGURA`, configurar credenciais e gravar novamente.
4. Conectar computador ao AP `BALLOONE_G5`, abrir `interface/index.html` (ou servir com `python -m http.server 8000` na pasta `interface`). Inserir token e conectar ao IP indicado no serial, normalmente `192.168.4.1`.
5. Verificar STOP inicial, comandos simulados no serial, RTT, perda de conexão e reconexão. Registrar resultados reais em `tests/registro_testes.csv`.

## Limites e bloqueadores para hardware
- O `applyMotor()` é simulado. Integrar somente após aprovação do driver, alimentação, pinos disponíveis, polaridades e teste de parada independente. Não conectar motores diretamente aos GPIOs.
- LED de conexão obrigatório do edital ainda depende da pinagem; não implementado.
- A API de câmera, biblioteca WebSocket e comportamento de watchdog devem ser confirmados por compilação e ensaio físico.
- A medição de RTT não representa tempo até movimento. FPS, latência de vídeo e coexistência BLE/Wi-Fi precisam de instrumentação e ensaios separados.
- A interface web local e WebSocket `ws://` devem ser usados apenas na rede AP isolada. Não há TLS nem autenticação do stream de vídeo.
- Se o firmware travar entre verificações do loop, o timeout não garante parada; um watchdog que reinicie a placa também não garante desenergização do driver sem projeto elétrico adequado.

## Testes de aceitação ainda necessários
1. Compilar para a variante exata da placa e testar inicialização com câmera ativa.
2. Tentar controlar sem token, com token incorreto e com segundo cliente.
3. Validar sequência antiga, reconexão, timeout, perda de foco e perda de energia.
4. Medir RTT p50/p95 e FPS real com vídeo ativo; repetir em cenário de interferência.
5. Integrar segurança de motores com firmware e eletrônica; testar STOP físico com rodas suspensas.
6. Comparar Wi-Fi com câmera ligada e desligada, e repetir com outros dispositivos na rede. A topologia de ponto de acesso da placa versus roteador central permanece em avaliação; este firmware implementa apenas o ponto de acesso da própria ESP32-CAM.

**Referências de escopo:** relatório PC1 Redes e Comunicação do Grupo 5 e edital Titans 2026/2. PC2 previsto para 23/11/2026.

## Decisões atualizadas — 03/11/2026
- **Protocolo de comandos escolhido:** WebSocket sobre Wi-Fi.
- **Transmissão de vídeo:** MJPEG sobre HTTP/Wi-Fi.
- **BLE:** fora do escopo atual, conforme orientação recebida da organização.
- **Topologia implementada:** a ESP32-CAM cria o AP `BALLOONE_G5`; conexão a roteador central ainda NÃO foi implementada.
- **Próxima validação:** conexão, comandos simulados, RTT com/sem vídeo, desconexão e estabilidade.
- **Atenção:** não há evidência de compilação, gravação ou testes físicos nesta revisão.
