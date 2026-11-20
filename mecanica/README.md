# Mecânica

Documentação técnica e modelagem 3D (CAD) da estrutura mecânica do robô **Balloone**.

---

## 1. Visão Geral e Responsabilidade Técnica
A concepção física foi desenvolvida em modelagem no **Autodesk Fusion**, priorizando baixo centro de massa, rigidez estrutural e facilidade de montagem e manutenção entre os rounds da competição.

* **Responsável única pelo subsistema (Sarah Teles Brito):** Execução integral da frente mecânica após a saída do segundo integrante antes do Ponto de Controle 1 (PC1), abrangendo modelagem das peças estruturais, alojamento eletromecânico, integração dos encaixes de ataque e balão, lista de materiais (BOM) e documentação.

---

## 2. Arquitetura Estrutural (Duas Peças)
O conjunto estrutural fabricável é composto por exatamente **duas peças principais**:

1. **Base Inferior:** Placa estrutural que integra as **colunas verticais de sustentação** para o segundo pavimento.
2. **Plataforma Superior:** Convés superior apoiado sobre as colunas da base inferior, que integra diretamente em sua geometria (impressos em conjunto à plataforma):
   * **Encaixe da haste do balão:** Acomodação vertical para a vareta plástica do suporte pega-balão, na parte traseira.
   * **Encaixe frontal de ataque:** Suporte integrado na dianteira para fixação do espeto de churrasco.

*(Nota: Foi decidido que o suporte dedicado da ESP32-CAM será modelado e posicionado em uma etapa posterior, após a impressão física destas duas peças estruturais para validação prática do ângulo de visão e espaço disponível.)*

---

## 3. Conformidade Dimensional com o Edital

| Parâmetro | Limite do Edital | Medida no CAD | Status |
| :--- | :--- | :--- | :--- |
| Comprimento da estrutura do robô | Até 23,0 cm | 19,0 cm | Conforme |
| Largura total (incluindo rodas) | Até 20,0 cm | 18,8 cm | Conforme |
| Projeção horizontal do ataque frontal | Até 25,0 cm | 23,3 cm | Conforme |
| Extremidade superior do suporte ao solo | Exatos 10,0 cm | 10,0 cm | Conforme |
| Centro do balão acima do suporte | Aprox. 11,0 cm | 11,0 cm | Conforme |

* **Exposição do balão:** O balão vermelho permanece 100% exposto em todas as direções, sem carenagens, escudos ou estruturas que dificultem o acesso dos adversários.

---

## 4. Locomoção, Nivelamento e Centro de Massa
* **Tração diferencial:** Dois motores DC amarelos (3–6V com caixa de redução) acoplados a rodas emborrachadas de 63 mm, garantindo aderência e giros no próprio eixo no piso pavimentado externo da Praça Solar.
* **Apoio dianteiro e nivelamento:** Rodízio giratório metálico (roda boba) de 25 mm montado sobre um ressalto espaçador modelado na face inferior da base, garantindo que o chassi opere paralelo ao solo.

---

## 5. Estratégia de Fixação
* **Ancoragem dos motores:** Orelhas verticais duplas na base inferior com folga lateral de 0,3 mm e filetes de reforço de 2,0 mm na raiz, combinadas a passagem de abraçadeiras de nylon como redundância contra choques laterais.
* **Padronização com rosca soberba:** Furos guia dimensionados em 2,6 mm no CAD para uso de parafusos rosca soberba de 3,0 mm na fixação dos módulos internos e do rodízio dianteiro, eliminando a necessidade de manipular porcas em locais de difícil acesso.
* **Isolamento das placas:** Previsão de espaçadores cilíndricos de 3 a 5 mm sob a Ponte H L298N, placa perfurada e conversor step-down para evitar contato das soldas com o chassi e favorecer a dissipação térmica.
* **Interface de operação:** Recorte retangular de 19,3 x 12,9 mm para encaixe rápido (*snap-in*) da chave gangorra geral.

---

## 6. Alternativas Analisadas e Descartadas
* **Rodas Mecanum:** Descartadas pela escassez de pinos GPIO na ESP32-CAM, perda de tração em piso externo irregular, menor força de arrasto em contato físico e exigência de quatro motores.
* **Encoders Ópticos:** Descartados em alinhamento com a equipe de eletrônica, pois os pinos livres restantes na placa Freenove ESP32-WROVER-CAM (GPIO 0, 2, 12 e 15) são pinos de boot sujeitos a falha de inicialização, além de sobrecarregarem a transmissão de vídeo sem ganho prático na teleoperação.
* **Rodízio maior ou esfera metálica (*ball caster*):** Descartados pelo risco de travamento de esferas em rejuntes externos e pelo peso extra, solucionando-se o nivelamento com o ressalto inferior na base.

---

## 7. Histórico de Iterações no CAD e Próximas Etapas
* **Absorção individual do subsistema:** Reorganização do cronograma após a saída do segundo integrante de mecânica antes do PC1, centralizando toda a modelagem e integração estrutural.
* **Iterações realizadas no CAD:**
  * Adição do ressalto dianteiro na base inferior para nivelar o rodízio com as rodas traseiras;
  * Ajuste de folga de 0,3 mm nas orelhas dos motores e inclusão de filetes de 2,0 mm para reforço estrutural;
  * Reposicionamento do suporte das baterias 18650 para manter livre o acesso aos parafusos do rodízio dianteiro;
  * Adaptação dos furos de fixação interna para 2,6 mm visando padronização com parafusos rosca soberba;
  * Evolução do chassi para estrutura em dois níveis (base inferior com colunas + plataforma superior integrando os encaixes do balão e do ataque frontal).
* **Próximas etapas:** Impressão 3D das duas peças estruturais, testes físicos de encaixe e modelagem do suporte da ESP32-CAM após validação presencial da montagem.

---

## 8. Organização desta Pasta
* `Lista_de_Materiais.pdf` — Relação final quantificada de filamento, fixadores rosca soberba, insumos e componentes de ataque/balão.
* `cad_editavel/` — Arquivo nativo do Autodesk Fusion (`.f3d`) e montagem completa exportada em `.step`.
* `stl_impressao/` — Malhas individuais prontas para impressão: `Base_Inferior.stl` e `Plataforma_Superior.stl`.
* `imagens_e_vistas/` — Capturas cotadas das vistas superior, lateral, frontal e isométrica.
