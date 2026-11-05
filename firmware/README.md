# Firmware

Programa que roda no robô (ESP32-CAM), incluindo a parte da comunicação do lado do robô. Ele fica em `balloone/balloone.ino`.

## Placa

Freenove ESP32-WROVER-DEV v1.6, com câmera OV2640.

A câmera usa a pinagem padrão dessa placa, a mesma do modelo `CAMERA_MODEL_WROVER_KIT` nos exemplos do Arduino.

## Pinos

Conferidos no esquemático em 05/11. Falta testar na placa.

| Pino | Ligação |
| --- | --- |
| GPIO13 | IN1 da ponte H |
| GPIO14 | IN2 da ponte H |
| GPIO32 | IN3 da ponte H |
| GPIO33 | IN4 da ponte H |
| GPIO15 | LED de conexão, com resistor de 330 Ω |

A origem é o esquemático e os fluxos: `eletronica/esquematico-eletronica.pdf` e `docs/fluxos-funcionamento.pdf`.
