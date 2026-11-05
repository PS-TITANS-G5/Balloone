# Comunicação (rede)

Como o notebook do piloto conversa com o robô. O código fica em `firmware/balloone/balloone.ino` (lado do robô) e em `interface/index.html` (lado do piloto).

**Situação em 05/11:** testado na placa. A rede, os comandos e o vídeo funcionam. Os motores ainda são simulados: o firmware só escreve o comando no monitor serial.

## Como funciona

O robô cria a própria rede Wi-Fi, e o notebook do piloto entra nela.

| Item | Valor |
| --- | --- |
| Rede | `BALLOONE_G5`, senha `123456789`, canal 6 |
| Endereço do robô | `192.168.4.1` |
| Aparelhos conectados | um por vez |

Por essa rede passam dois caminhos:

- **Comandos (WebSocket, porta 81):** a interface envia o comando atual a cada 100 ms, no formato `token,número,comando`, como `balloone,15,FWD`. Os comandos são `FWD`, `BACK`, `LEFT`, `RIGHT` e `STOP`. O robô responde `ACK` ou um erro (`ERR:...`).
- **Vídeo (HTTP, porta 80):** a câmera envia uma sequência de imagens JPEG (MJPEG) em `http://192.168.4.1/stream`, em 320×240 e com no máximo cerca de 14 quadros por segundo.

## Regras de segurança

- A conexão sempre começa com `STOP`.
- Só um aparelho controla o robô por vez.
- Um comando com número repetido ou menor que o anterior é recusado.
- Se nenhum comando chegar em 350 ms, o robô para e encerra a conexão.
- Soltar a tecla ou trocar de janela envia `STOP`.

## Por que assim

- **Wi-Fi puro:** orientação da organização. O Bluetooth dividiria o rádio da placa com o Wi-Fi.
- **WebSocket:** mantém uma conexão aberta nos dois sentidos e funciona direto no navegador.
- **MJPEG:** cada quadro é uma imagem independente, então um quadro perdido não estraga os seguintes.

O `estudo.pdf`, feito para o PC1, compara as alternativas em detalhe. Ele propunha Bluetooth para os comandos, opção descartada em 03/11. O registro das decisões fica no Notion.

## Como testar

1. Grave o firmware (veja `firmware/README.md`) e abra o monitor serial. Deve aparecer `IP=192.168.4.1`.
2. Conecte um notebook à rede `BALLOONE_G5`.
3. Abra `interface/index.html` no navegador desse notebook, digite o token `balloone` e clique em **Conectar**.
4. Use os botões da tela ou as setas do teclado. Cada comando aparece no monitor serial, como `MOTOR_SIMULADO=FWD`.

Anote os resultados em `registro-testes.csv`.

**Testes que faltam:**

- Medir o tempo de resposta (RTT, mostrado na interface) em pelo menos 100 comandos, com e sem vídeo.
- Medir os quadros por segundo do vídeo. A interface ainda não mede.
- Desligar o Wi-Fi do notebook e ver o robô parar (`FAILSAFE_TIMEOUT` no monitor serial).
- Tentar conectar um segundo aparelho e usar um token errado.
- Repetir os testes com outras redes Wi-Fi por perto.

## O que falta

- **Motores:** o firmware ainda não aciona a ponte H.
- **LED de conexão:** o pino está definido (IO15), mas o LED ainda não foi programado.
- **Reconexão:** depois de 350 ms sem comandos, a conexão cai, e o piloto precisa clicar em **Conectar** de novo.
- **Canal:** fixo no 6. Com cinco robôs na mesma área, pode ser preciso trocar.
- **Parada garantida:** se o firmware travar, nada desliga os motores. Isso precisa de uma solução na eletrônica.
- **Rede da competição:** usar um roteador central no lugar da rede do robô ainda está em avaliação.
