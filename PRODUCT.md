# Balloone

- Robô do Grupo 5 no processo trainee Titans; um operador controla movimento e acompanha vídeo frontal, uso no celular, proporção 22:9, o que equivale exatamente a 2640 x 1080 pixels na horizontal.
- Dispositivo de pilotagem: celular, para mobilidade e praticidade em ambiente externo. Notebook serve ao desenvolvimento, não à operação na arena.
- Interface web pelo Wi-Fi do robô, sem depender de internet. Hospedagem na ESP32 é proposta ainda não implementada.
- Controle por toque, quatro direções e PARAR; vídeo MJPEG e comandos WebSocket no contrato atual.
- Objetivo visual explícito: interface funcional e bonita, com identidade Titans.
- Autoridade de marca: manual Titans de fevereiro de 2020, documentado em DESIGN.md. As imagens anteriormente usadas para amostragem não prevalecem sobre o manual.
- Estado atual: protótipo de bancada, motores simulados; esta documentação não atesta prontidão para competição.

Requisitos e contrato: [interface/requisitos-e-stack.md](interface/requisitos-e-stack.md).
