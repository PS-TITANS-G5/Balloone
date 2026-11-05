# Firmware

Programa que roda no robô, em `balloone/balloone.ino`. Ele cria a rede Wi-Fi, recebe os comandos e transmite o vídeo. O funcionamento está explicado em `docs/rede/README.md`.

## Placa

Freenove ESP32-WROVER-DEV v1.6, com câmera OV2640. A câmera usa a pinagem padrão da placa, a mesma do modelo `CAMERA_MODEL_WROVER_KIT` nos exemplos do Arduino.

## Pinos

Conferidos no esquemático (`eletronica/esquematico-eletronica.pdf`) em 05/11. Ainda não são usados, porque os motores e o LED continuam simulados.

| Pino | Ligação |
| --- | --- |
| IO13 | IN1 da ponte H (motor P1) |
| IO14 | IN2 da ponte H (motor P1) |
| IO32 | IN3 da ponte H (motor P2) |
| IO33 | IN4 da ponte H (motor P2) |
| IO15 | LED de conexão, com resistor de 330 Ω |

## Como compilar e gravar

Use o VS Code com a extensão PlatformIO. O `platformio.ini`, na raiz do repositório, já define a placa e as bibliotecas.

1. **Compilar:** clique no ✓ da barra azul, embaixo.
2. **Conectar a placa:** se o VS Code roda dentro do WSL, empreste o USB ao WSL. No PowerShell, rode `usbipd attach --wsl --busid <BUSID>`. O BUSID aparece em `usbipd list`. Na primeira vez, rode antes `usbipd bind --busid <BUSID>` como administrador.
3. **Gravar:** clique na seta → da barra azul.
4. **Conferir:** clique na tomada para abrir o monitor serial e aperte o botão de reset da placa. Deve aparecer `IP=192.168.4.1`.
