# Plano de testes — Balloone G5 / PC2

## Preparação
1. Confirmar a placa Freenove ESP32-WROVER-DEV v1.6, o cabo USB e alimentação estável.
2. Substituir senha e token de exemplo no firmware.
3. Compilar e gravar com Arduino ESP32 core 3.x e biblioteca WebSockets by Markus Sattler.
4. Abrir monitor serial a 115200 baud; conectar notebook ao AP BALLOONE_G5.
5. Abrir interface/index.html e informar IP e token.

## Execução
- **Conectividade:** iniciar sessão com STOP, verificar ACK e manter conexão por 5 minutos.
- **Comandos:** enviar FWD/BACK/LEFT/RIGHT e STOP; verificar apenas logs MOTOR_SIMULADO.
- **RTT:** coletar ao menos 100 respostas com vídeo desligado e 100 com vídeo ligado; registrar mediana e p95.
- **Vídeo:** verificar se stream aparece e observar congelamentos; FPS não é medido pelo protótipo atual.
- **Falha:** desconectar Wi-Fi e verificar no serial o STOP simulado e reconexão segura.
- **Concorrência:** tentar segundo cliente e confirmar rejeição de controle simultâneo.

## Restrições
- Não ligar motores ao protótipo: faltam driver, mapeamento de GPIO e parada independente.
- O protótipo atual usa AP da ESP32-CAM, não roteador central.
- Nenhum resultado experimental deve ser declarado antes de medir em hardware.
