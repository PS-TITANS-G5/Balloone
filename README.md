# Balloone · Grupo 5

## O que é

Robô de controle remoto com ESP32-CAM, feito pelo Grupo 5 no processo trainee da Titans, a equipe de robótica da UnB (FCTE), para uma competição de estourar balões.

O projeto, a equipe e as datas estão na [página da organização](https://github.com/PS-TITANS-G5). As tarefas, as decisões e os documentos de gestão ficam no Notion do grupo. O código e os documentos técnicos ficam aqui.

## Pastas

| Pasta | O que vai nela |
| --- | --- |
| `firmware/` | programa que roda no robô (ESP32-CAM) |
| `interface/` | tela do piloto |
| `eletronica/` | esquemáticos, placa e lista de componentes |
| `mecanica/` | CAD exportado (STEP, STL), desenhos e imagens |
| `docs/` | o que envolve o robô todo: requisitos, arquitetura, fluxos, comunicação e testes |

O código de comunicação fica em `firmware/` e `interface/`. Os documentos sobre comunicação ficam em `docs/rede/`.

## Palavras do GitHub

- **Commit:** um registro de mudança, com uma mensagem curta dizendo o que mudou.
- **Branch:** uma linha de trabalho separada, onde você muda o projeto sem mexer na versão principal, a `main`.
- **Pull request (PR):** o pedido para juntar uma branch na `main`. Outra pessoa revisa antes.

## Como contribuir

A `main` só aceita mudanças por pull request, com a aprovação de outra pessoa. A regra vale para arquivos e código.

**Arquivos (PDF, imagem, CAD):** suba pelo navegador. Abra a pasta certa, clique em *Add file → Upload files* e escreva uma mensagem curta. Escolha criar uma nova branch, clique em *Propose changes* e abra o pull request. Depois da aprovação, o arquivo entra na `main`.

**Código:**

1. Crie uma branch.
2. Faça os seus commits nela.
3. Abra um pull request para a `main`.
4. Alguém da sua área revisa. Depois da aprovação, o código entra na `main`.

## Boas práticas

- Antes de subir um arquivo, pense se ele é necessário e se está na pasta certa.
- Use nomes em minúsculas, com hífen e sem acento, como `esquematico-motores.pdf`. O nome diz o assunto, sem grupo, data ou versão.
- Para atualizar um documento, edite ou substitua o mesmo arquivo. Não crie cópias como `final_v2`: o GitHub já guarda o histórico.
- Documento que muda fica em Markdown, que dá para editar no navegador. PDF fica para o que vem de outra ferramenta, como esquemático e CAD.
- Escreva mensagens de commit curtas, começando pela área (o nome da pasta), como `firmware: liga os motores`.
- Nunca suba senhas pessoais, como as de contas ou do Wi-Fi de casa.
- Pelo navegador, o limite é de 25 MB por arquivo. No caso do CAD, suba o arquivo exportado e o link do projeto original.
