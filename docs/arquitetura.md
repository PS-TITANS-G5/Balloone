# Arquitetura

Como as partes do Balloone se ligam. O funcionamento da rede está em [`rede/README.md`](rede/README.md), e os detalhes elétricos, no [esquemático](../eletronica/esquematico-eletronica.pdf).

## Diagrama de blocos

```mermaid
---
config:
  layout: elk
  flowchart:
    curve: step
---
flowchart LR
  subgraph piloto["Piloto"]
    NB["Notebook<br>(interface no navegador)"]
  end

  subgraph robo["Robô"]
    BAT["Bateria"]
    CHV["Fusível e chave"]
    REG["Regulador 5 V"]
    CAM["Câmera"]
    ESP["Placa ESP32"]
    PH["Ponte H"]
    ME["Motor esquerdo"]
    MD["Motor direito"]
    LV["LED verde<br>(ligado)"]
    LR["LED vermelho<br>(conexão)"]
  end

  BAT ==> CHV
  CHV ==> REG
  CHV ==> PH
  REG ==>|"5 V"| ESP
  REG ==>|"5 V"| PH
  REG ==>|"5 V"| LV
  PH ==> ME
  PH ==> MD

  CAM -->|"imagem"| ESP
  ESP -->|"direção"| PH
  ESP -->|"aceso ou apagado"| LR

  NB <-.->|"comandos (WebSocket)<br>vídeo (MJPEG)"| ESP
```

- **Linha grossa:** energia.
- **Linha fina:** sinal elétrico.
- **Linha tracejada:** Wi-Fi. Os comandos vão do notebook para a placa, e o vídeo volta da placa para o notebook.

Para mudar o diagrama, edite o texto do bloco `mermaid`. Dá para testar antes em [mermaid.live](https://mermaid.live).

## Em aberto

- **Proteção da bateria:** não há placa de proteção (BMS) para as duas células.
- **Parada garantida:** se o firmware travar, nada desliga os motores.
- **Rede da competição:** hoje a placa cria a própria rede. Um roteador central ainda está em avaliação.
