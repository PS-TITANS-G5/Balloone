---
name: Balloone - identidade Titans
description: Identidade oficial Titans e aplicação à interface de pilotagem móvel
colors:
  titans-red: "#C72612"
  titans-gold: "#D0830F"
  titans-wine: "#560204"
  titans-brown: "#1A0001"
  titans-orange: "#D66A2A"
  titans-salmon: "#D7604C"
  white: "#FFFFFF"
  black: "#000000"
---

# Design System: Balloone / Titans

## Overview

A marca associa o elmo a inteligência e estratégia; vermelho a paixão e perseverança, vinho a coragem e dourado a valores e realizações (pp. 3 e 9). Preservar essa identidade sem transformar a interface operacional em uma peça promocional. O contexto do produto está em [PRODUCT.md](PRODUCT.md), e as escolhas da tela em [interface/pilotagem.design.md](interface/pilotagem.design.md).

## Colors

Os oito valores normativos estão no frontmatter, transcritos dos códigos HEX e conferidos com RGB nas pp. 2 e 9. Para tela, usar HEX/RGB do manual, não amostrar a aparência renderizada do PDF nem converter os valores CMYK.

- Principais: vermelho (`titans-red`), dourado (`titans-gold`) e vinho (`titans-wine`). Vermelho é a assinatura principal.
- Secundárias: branco e preto.
- Complementares: marrom, salmão e laranja, descritas como terrosas e sóbrias.
- O manual não fixa porcentagens de uso, gradientes para componentes ou paletas de estados de software. Não atribuir essas regras à marca.

A tela usa fundo creme (#F4F1EB), texto escuro e câmera sobre preto. Os direcionais são brancos quando disponíveis, cinza quando bloqueados e dourados quando pressionados. PARAR usa vermelho Titans e texto branco.

## Typography

**Oficial:** Pythia by Blambot compõe o nome Titans no logotipo (p. 3). O manual descreve tamanho 76 e espaçamento entre caracteres 56 na construção original, com centralização pelo elmo e escalonamento conjunto. Essas medidas não são CSS nem uma recomendação de tamanho para texto da interface. Usar o arquivo oficial da marca em vez de reconstruir o nome com uma fonte aproximada.

A página 11 lista Copperplate Gothic Light, Copperplate Gothic Bold e Myriad Pro entre as fontes dos textos do manual. Não estabelece uma escala tipográfica para aplicativos nem exige usar todas essas fontes na interface.

**Aplicação na interface:** `system-ui, sans-serif` nos comandos, estados e métricas, para leitura em tela pequena e execução offline. Não aplicar Pythia aos textos operacionais. Nenhuma fonte proprietária foi extraída, instalada ou embutida; uso de arquivos de fonte depende da disponibilidade e licença apropriadas.

## Layout

**Oficial, p. 5:** manter composição e proporções da marca; apresentações quadradas centralizadas com espaço vazio de 11% da altura total para cada lado a partir do nome. Em borda superior de documento, espaçamento acima; em borda inferior, abaixo. Altura da marca em múltiplos de 5. Aplicar as medidas à marca, não como espaçamento universal da interface.

Mínimos ilustrados e conferidos visualmente:

| Meio | Logo completa | Ícone |
|---|---|---|
| Mobile | 45 × 45 px | 15 × 15 px |
| Web | 45 × 45 px | 20 × 20 px |
| Impressão | 1,5 × 1,5 in | 1 × 1 in |

Para navegador no celular, adotar conservadoramente mínimo web de 20 px para o ícone e 45 px para a composição completa; aumentar conforme legibilidade. Esses mínimos são da marca, não alvos de toque.

**Com outras marcas, p. 8:** empilhar composições quadradas; usar arranjo horizontal para marcas estendidas. Não misturar indevidamente essas disposições.

## Elevation & Depth

**Oficial, p. 7:** não adicionar sombra à logo. Não aplicar transparência/opacity ao Logotipo de Batalha; isso é distinto do fundo vazio previsto para o ícone flat.

O manual não especifica sombras de componentes. Para o Balloone, a proposta é separar áreas por tons e espaçamento, sem inventar efeitos sobre a marca.

## Shapes

**Oficial, pp. 3–4 e 7:** preservar forma, proporções e posições relativas; não esticar, deformar, rotacionar, redesenhar ou recolorir arbitrariamente a logo.

Quatro configurações: Logotipo Puro/de Batalha, ícone flat (elmo com fundo vazio, indicado para web/mobile), avatar circular (elmo centralizado em círculo branco; aro preto ilustrativo não integra o ícone) e logotipo horizontal. Não criar versões próprias por recorte ou reorganização dos elementos.

**Cores de uso, p. 6:** preferir a versão completa de Batalha; preta para fundos claros nas situações previstas; branca para fundos escuros; econômica monocromática em uma cor da marca, com contraste, destinada às aplicações descritas como serigrafia, gravação e identificação de objetos. As variantes previstas não autorizam recoloração livre.

O manual não define raios de borda ou geometria dos botões. Resolver esses valores na implementação da tela.

## Components

A interface importa as cores de [titans-tokens.css](interface/titans-tokens.css). O cabeçalho exibe o PNG transparente do elmo fornecido pelo grupo, em proporção original. A altura da imagem é 90 px no desktop, 75 px em telas estreitas e 70 px na paisagem compacta.

## Do's and Don'ts

### Do

- Usar os códigos do manual como autoridade cromática.
- Preservar proporções, respiro, tamanho mínimo e variantes da marca.
- Priorizar a marca em cores completas e verificar contraste com o fundo.
- Identificar adaptações de UI como decisões do projeto.
- Preservar as cores reais da câmera e comunicar estados também por texto.

### Don'ts

- Não reutilizar as cores aproximadas das capturas como valores oficiais.
- Não deformar, girar, sombrear, redesenhar ou recolorir livremente a logo.
- Não reduzir a opacidade do Logotipo de Batalha para simular estado desabilitado.
- Não inferir endosso ou parceria apenas pelo uso da marca (p. 10).
- Não tratar fontes listadas no PDF como arquivos licenciados para redistribuição.
- Não usar emojis, gradientes ou sombras acima de 20% transparência.
