# Firmware

Programa que roda no robô (ESP32-CAM), incluindo a parte da comunicação do lado do robô. Ele fica em `balloone/balloone.ino`.

## Placa

Freenove ESP32-WROVER-DEV v1.6, com câmera OV2640.

O protótipo atual ainda usa a pinagem da AI Thinker e precisa ser corrigido.

## Pinos

Mapeamento planejado, ainda a conferir na placa:

| Pino | Ligação |
| --- | --- |
| GPIO13 | IN1 da ponte H |
| GPIO14 | IN2 da ponte H |
| GPIO32 | IN3 da ponte H |
| GPIO33 | IN4 da ponte H |
| GPIO15 | LED de conexão, com resistor de 330 Ω |

A origem é o esquemático e os fluxos: `eletronica/esquematico-eletronica.pdf` e `docs/fluxos-funcionamento.pdf`.
