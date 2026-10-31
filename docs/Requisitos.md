# Requisitos do Balloone

Este documento reúne os requisitos funcionais e não funcionais do Balloone analisados a partir do edital do Processo Trainee Titans 2026/2, datado de 3 de outubro de 2026. A organização segue o exemplo de requisitos fornecido no chat, com identificadores, verbos no infinitivo e referências às seções do edital.

Fonte: `Processo_trainee_PS_Titans_2026_2__Copy_-3 (1).pdf`.

Os requisitos obrigatórios, as recomendações e as regras operacionais estão identificados separadamente para preservar o sentido do edital.

## Requisitos funcionais

Os requisitos funcionais descrevem o que o sistema deve fazer.

| ID | Requisito funcional | Referência |
|---|---|---|
| RF01 | Permitir o controle remoto do Balloone por meio de comunicação sem fio. | Seções 7 e 12 |
| RF02 | Movimentar o robô para frente mediante comando do operador. | Seção 7 |
| RF03 | Movimentar o robô para trás mediante comando do operador. | Seção 7 |
| RF04 | Movimentar o robô para a esquerda mediante comando do operador. | Seção 7 |
| RF05 | Movimentar o robô para a direita mediante comando do operador. | Seção 7 |
| RF06 | Estourar os balões distribuídos na arena e/ou dos adversários utilizando um mecanismo frontal. | Seções 4.1 e 5.4 |
| RF07 | Capturar e transmitir a visão frontal do robô por meio da ESP32-CAM durante sua operação. | Seções 4.2 e 8.1 |
| RF08 | Exibir a transmissão da ESP32-CAM em uma interface de visualização, permitindo ao operador navegar e localizar balões fora de sua linha de visão direta. | Seções 5.2 e 8.2 |
| RF09 | Fixar e sustentar o balão do próprio robô por meio de um suporte. | Seção 6 |
| RF10 | Permitir a substituição do balão do próprio robô quando ele for estourado. | Seções 6 e 6.1 |
| RF11 | Permitir ligar e desligar o sistema por meio de uma chave física. | Seção 10.1 |
| RF12 | Indicar, por meio de LED, que o Balloone está ligado. | Seção 10.1 |
| RF13 | Indicar, por meio de LED, a conexão sem fio com o dispositivo utilizado para controlar o robô. | Seção 10.1 |

## Requisitos não funcionais

Os requisitos não funcionais descrevem as características, qualidades e restrições do sistema.

| ID | Categoria | Requisito não funcional | Referência |
|---|---|---|---|
| RNF01 | Físico: dimensões | Limitar o comprimento da estrutura do robô a **23 cm**. | Seção 6.2 |
| RNF02 | Físico: dimensões | Limitar a largura total do robô a **20 cm**, incluindo rodas e quaisquer componentes que ultrapassem lateralmente a estrutura. | Seção 6.2 |
| RNF03 | Físico: dimensões | Limitar o comprimento do mecanismo frontal a **25 cm**, medido horizontalmente. | Seção 6.2 |
| RNF04 | Físico: posicionamento | Posicionar a extremidade superior do suporte do balão a **10 cm do chão**. | Seção 6.2 |
| RNF05 | Físico: posicionamento | Posicionar o centro do balão aproximadamente **11 cm acima da extremidade superior do suporte**, na direção vertical. | Seção 6.2 |
| RNF06 | Físico: padronização | Utilizar no robô um balão **vermelho**, com o mesmo padrão e tamanho dos balões disponibilizados pela organização. | Seção 5.2 |
| RNF07 | Restrição da competição | Manter o balão totalmente exposto em todas as direções, sem estruturas, carenagens ou mecanismos destinados a protegê-lo, escondê-lo ou dificultar seu acesso. | Seções 6.1 e 6.2 |
| RNF08 | Confiabilidade mecânica | Garantir uma estrutura suficientemente robusta para operar durante os **três rounds** da competição. | Seção 6 |
| RNF09 | Físico: montagem | Dispor de uma estrutura capaz de acomodar os componentes eletrônicos e de um suporte seguro para a ESP32-CAM. | Seção 6 |
| RNF10 | Restrição tecnológica | Utilizar uma **ESP32-CAM própria do Balloone** como microcontrolador e câmera embarcada. | Seções 4.2 e 10.1 |
| RNF11 | Físico: instalação da câmera | Posicionar a ESP32-CAM de forma a fornecer uma visão frontal do robô ao operador. | Seção 8.1 |
| RNF12 | Confiabilidade da comunicação | Garantir estabilidade de comunicação suficiente para controlar o Balloone durante a competição. | Seção 7 |
| RNF13 | Ambiente operacional | Considerar a operação simultânea com outros robôs e sistemas sem fio na área delimitada da Praça Solar, incluindo possíveis interferências na comunicação. | Seções 4.1 e 13.3 |
| RNF14 | Compatibilidade elétrica | Utilizar uma fonte de alimentação adequada aos componentes eletrônicos empregados. | Seção 10.1 |
| RNF15 | Usabilidade: sinalização | Utilizar **cores diferentes** para os LEDs de indicação de alimentação e de conexão sem fio, mantendo ambas as sinalizações visíveis externamente. | Seção 10.1 |
| RNF16 | Restrição construtiva | Realizar a montagem eletrônica em **placa perfurada ou placa de fenolite cobreada**, sem utilização de protoboard na entrega final. | Seção 10.2 |
| RNF17 | Manutenibilidade | Estruturar o sistema de forma modular e de fácil manutenção. | Seção 13.1 |
| RNF18 | Integração | Garantir o funcionamento integrado da estrutura mecânica, eletrônica, alimentação, motores, comunicação sem fio, ESP32-CAM, transmissão de vídeo e interface de operação. | Seções 12 e 14 |
| RNF19 | Segurança física | Garantir condições seguras de operação do robô e de utilização do mecanismo frontal durante a competição. | Seções 6.2 e 19 |

## Requisitos organizacionais

Estes itens seguem a categoria organizacional do exemplo fornecido, mas dizem respeito ao desenvolvimento e à entrega do projeto, e não ao comportamento do robô.

| ID | Categoria | Requisito | Referência |
|---|---|---|---|
| RNF20 | Organizacional: escopo | Desenvolver, apresentar e utilizar **exatamente um Balloone por equipe**. | Seção 4.2 |
| RNF21 | Organizacional: desenvolvimento | Projetar e construir o Balloone e seu mecanismo frontal pelo próprio grupo, respeitando as restrições do edital. | Seções 4.1 e 6 |
| RNF22 | Organizacional: decisões técnicas | Pesquisar, escolher e justificar a arquitetura, os protocolos e as tecnologias utilizados, considerando as restrições do projeto, os componentes disponíveis e o desempenho necessário. | Seções 7, 8.3 e 13 |
| RNF23 | Organizacional: arquitetura | Documentar o fluxo de dados, a transmissão dos comandos e do vídeo, os protocolos e a integração entre os componentes. | Seções 13.1 e 15 |
| RNF24 | Organizacional: validação | Realizar testes antes da competição para identificar falhas de integração, gargalos de comunicação, atrasos e instabilidades de transmissão. | Seção 12 |
| RNF25 | Organizacional: análise de falhas | Identificar perdas de conexão, falhas de componentes, pontos únicos de falha, limitações de hardware e interferências; realizar testes em cenários adversos sempre que possível. | Seção 13.3 |
| RNF26 | Organizacional: documentação | Entregar código-fonte, documentação e relatório final com as decisões técnicas, registros do desenvolvimento, testes e resultados, incluindo CAD e esquemáticos conforme aplicável. | Seções 14 e 15 |
| RNF27 | Organizacional: prazo | Entregar o relatório final até **4 de dezembro de 2026** e apresentar o Balloone funcional na competição de **5 de dezembro de 2026, às 10h**, participando dos três rounds. | Seções 14 e 17 |

## Recomendações e critérios de qualidade

O edital apresenta os itens abaixo como preferências ou aspectos de avaliação. Eles não devem ser transformados em exigências com valores arbitrários.

| Item | Classificação | Formulação | Referência |
|---|---|---|---|
| Interface unificada | Funcional, preferencial | Reunir transmissão de vídeo, comandos de controle, identificação do Balloone e informações adicionais relevantes na interface do jogador. | Seção 9 |
| Qualidade da interface | Não funcional, usabilidade | Favorecer clareza, facilidade de uso, estabilidade e adequação ao contexto da competição. | Seção 9 |
| Qualidade do vídeo | Não funcional, desempenho e confiabilidade | Avaliar latência, estabilidade, taxa de quadros, resolução, travamentos, consumo de recursos e comportamento diante de instabilidades de rede. | Seção 8.3 |

O edital não estabelece valores mínimos de FPS ou resolução, nem um limite numérico de latência. Metas quantitativas adotadas pela equipe deverão ser identificadas como decisões do projeto.

## Regras operacionais da competição

- Permitir **no máximo um operador por Balloone**.
- Manter um balão instalado durante toda a participação ativa do robô.
- Interromper a participação quando o balão for estourado e retornar somente após sua substituição correta, a partir do mesmo ponto de retirada.
- Respeitar a duração máxima de **15 minutos por round**, em três rounds.
- Realizar contato com adversários exclusivamente pelo robô e seus componentes, sem contato manual dos integrantes da equipe com os robôs adversários.

Referências: seções 4.2, 5.1, 5.4 e 6.1.


