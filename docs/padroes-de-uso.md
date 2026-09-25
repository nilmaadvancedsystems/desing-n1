# Nilma UI — padrões de uso

Como cada parte da interface **se comporta**, para replicar em qualquer sistema do ecossistema Nilma.
A **aparência** está no `kit/nilma-ui-kit.html`, com `css/nilma.css` e `js/nilma.js`. O jeito mais rápido de começar é `templates/esqueleto.html`. Este arquivo é a **lógica**: quando usar, o que acontece ao clicar e o que aparece em cada estado.

Referência viva: Conferência Contábil (`conferencia-nilma.web.app`), beta 0.1.18.

---

## 1. Princípios

1. **Sem texto explicativo à toa.** A tela se explica pelo título, pelos rótulos e pelos estados. Texto de ajuda só onde evita erro (ex.: "Excel do balancete (XLS Dados Arquivo)").
2. **Uma ação principal por área**, em vermelho (`btn-primary`). O resto é contorno, texto (`link-btn`) ou ícone.
3. **Cor pelo significado, nunca pela estética.**

   | Cor | Significado |
   |---|---|
   | Vermelho da marca | Ação principal, item ativo |
   | Laranja (`--danger`) | Entrada, diferença, atenção, "Conferido" manual |
   | Verde (`--success`) | Saída, Ok, sucesso |
   | Amarelo (`--warn`) | Aviso |
   | Cinza | Informação de apoio |

4. **Números sempre alinhados** (`tabular-nums`), em formato brasileiro (`1.234,56`), alinhados à direita nas tabelas (`class="num"`).
5. **Mostrar só o que tem conteúdo.** Caixa de resultado zerada não aparece, e nem linha de total vazia. Seção sem dado mostra um vazio curto ("Nenhuma nota…").
6. **Estado sempre visível.** O que foi feito fica marcado na própria tela (riscado, badge, pílula) e registrado no histórico.
7. **Nada de dado sensível guardado sem necessidade.** Arquivos de conferência pontual (ex.: relatório da conta) ficam só na memória e somem ao sair da tela.
8. **Padronizar antes de inventar.** Se já existe um componente para aquilo, use o mesmo tamanho, fonte e espaçamento. Variações só quando são intencionais e iguais em todas as telas (ex.: tabela compacta).

---

## 2. Estrutura e navegação

### Esqueleto
- **Cabeçalho:** ☰ (gaveta), logo, trilha `Sistema / Código da empresa ▾`. Embaixo ficam as **abas da seção** aberta.
- **Menu lateral fixo:** as **seções** do sistema, sempre as mesmas, com uma linha separando os grupos. Rodapé: "Ocultar barra lateral", preferência lembrada no navegador.
- **Área da página:** título à esquerda e **ações da página no canto superior direito** (ex.: "Baixar CSV", chave "Apagar ao sair").
- **Seletor interno** da página (ex.: Entradas/Saídas, Resumido/Detalhado): logo **abaixo do título**, em `.steps`.

### Regras de navegação
- **Menu lateral:** clicar numa seção abre **sempre a primeira página** dela, já na **primeira aba interna**.
- **Abas de cima:** voltam **onde a pessoa parou**, mantendo a aba interna escolhida antes.
- **Gaveta (☰):** navegação geral do ecossistema (Início) e **tema** (claro / escuro / sistema). Fecha com ×, clicando fora ou com Esc.
- **Trocar de tela:** fecha mensagens flutuantes e descarta dados temporários da tela anterior.

### Entrada (escolher empresa)
- **Tela mínima:** logo, título e um campo "nome ou código".
- **Lista:** conforme a pessoa digita, aparece a lista, com o **código exato primeiro**, depois os códigos que começam com o que foi digitado e depois o resto.
- **Enter:**
  - com o **código exato** (ex.: `58`), entra direto na empresa;
  - se a busca achou **uma só** empresa, entra nela;
  - com várias, um toast pede para escolher na lista;
  - sem nenhuma, avisa que não achou.

### Travas por falta de dado
- Uma página que depende de um dado ainda não importado fica **travada**, com opacidade e cursor de bloqueio.
- Clicar nela mostra um **aviso** dizendo o que falta e com o botão para ir importar ("Importar serviços tomados").
- As **abas internas** (Entradas, Saídas…) também travam individualmente. Se a aba aberta ficar travada, a tela volta para uma que tem dado.
- Seção inteira travada (ex.: Cadastro sem nenhuma importação) leva direto para a primeira importação pendente.

---

## 3. Importação de arquivo

1. **Card de importação:** título com ícone, campo "Escolher arquivo" (`file-picker`), botão **Importar** e uma dica curta do formato.
2. **Validação antes de gravar:**
   - **Arquivo de outro tipo** (ex.: saídas no lugar de entradas): mostra um alerta explicando e não importa.
   - **Arquivo de outra empresa** (comparando com a assinatura da última importação): pergunta antes de gravar.
3. **Já existe dado:** abre um modal com **Cancelar · Sobrepor o movimento · Importar apenas novas**.
   - *Apenas novas*: acrescenta o que não existe e corrige o que mudou (ex.: lançamento).
   - *Sobrepor*: troca tudo pelo arquivo novo.
4. **Resultado:** mensagem **flutuante** no canto, com quantas foram gravadas, quantas já existiam e quantas ficaram de fora. Some em **3,7 s**, tem **×** e fecha ao trocar de tela.
5. **Depois de importado:** a caixa de importação **some** e fica o que foi importado (resumo + tabela). Embaixo, à direita: **Reimportar** (texto) + **Excluir** (vermelho).
   - *Reimportar* traz a caixa de volta e já abre a escolha de arquivo.
   - *Excluir* pede confirmação.
6. **Botão durante o processamento:** fica com spinner e o texto "Importando…", desabilitado. Ao terminar, volta ao normal.
7. **Histórico:** toda importação ou exclusão vai para a Auditoria, com data, tipo, quantidade e o modo usado (sobreposto etc.).

---

## 4. Cadastro (vínculos e configurações)

### Vínculo com conta (chip)
- **Sem conta vinculada:** aparece o botão **"Vincular conta"**, que abre um campo de busca com lista suspensa (nome ou código).
- **Com conta vinculada:** aparece o **chip** `código — nome` com × para desvincular.
- **Quando a regra é "uma só"**, o botão de adicionar **some** depois de vincular. Para trocar, tira no × e vincula outra.

### Categorias fixas + itens do usuário (ex.: serviços)
- **Cada categoria:** nome, badge com o valor fixo ("Lançamento 38") e as linhas **Conta** e **Fornecedores**, com os rótulos alinhados à esquerda.
- **Lista de itens:** em caixa com borda. Cada linha tem o nome (com "…" se não couber), um dado de apoio em cinza ("8 notas") e **×**, que só se destaca ao passar o mouse.
- **"+ Adicionar …":** é a **última linha da lista** e abre o formulário ali mesmo.
- **Formulário de adicionar:**
  - campos com lista suspensa;
  - o segundo campo fica **travado até o primeiro ser escolhido**;
  - **Adicionar só libera quando está tudo escolhido**;
  - depois de escolher um código, o campo mostra **só o código**; o nome fica na lista e no *hover*.
- **Item permanente** (regra do escritório): mostra só o **cadeado**, sem texto e sem ações. Os participantes fixos ficam na regra, não na tela.
- **Sugestões:** itens encontrados nos dados que parecem pertencer à categoria aparecem com "+ Nome" para incluir num clique.

### Opção liga/desliga que revela campos
- Chave **On/Off** (`toggle-switch`) no topo do card, com uma frase curta dizendo o que conta.
- **Ligada:** aparece, onde se aplica, uma pílula tracejada **"+ Rótulo"**.
  - Clicando, vira um campo pequeno com ✓ e ✗ (Enter salva, Esc cancela).
  - Depois de salvo, vira uma **pílula cinza** com o valor (ex.: "Lançamento Automático 0001"). Clicar altera; × remove.
- **Vazio = padrão:** sem valor cadastrado, vale o padrão calculado (ex.: o que mais aparece nos dados), mostrado ao lado em cinza.

---

## 5. Relatório (tela de conferência)

- No Movimento, as abas são **Relatório** (ícone `relatorio`) · **Checklist** (ícone `checklist`, título da página "Naturezas de CFOP") · **Consulta**.
- **Divergência de lançamento:** `Atual <b>00182</b> — Correto: <b>00001</b>` quando o lançamento certo foi cadastrado pelo usuário; `Atual … — Maioria: …` quando vem da maioria das notas. Código sempre com os zeros da nota.

### Resumo
- **Números principais** em `stat-grid`, com rótulo curto, numa linha só quando couber.
- **Cor pelo significado:** entradas em laranja, saídas em verde.

### Tabela "confere com o saldo" (compacta)
- **Colunas:** Conta · origem · Soma · Saldo · **Situação**.
- **Situação:**

  | Estado | O que aparece |
  |---|---|
  | Bateu | badge **Ok** |
  | Diferença | badge com o valor da diferença + ícone **Revisar** |
  | Conferido à mão ou pela revisão | badge **Conferido** laranja + Revisar |
  | Revisão feita sem pendências | badge **Ok** (o *hover* mostra a diferença original) |
  | Soma zero | badge neutro "0,00", fora da conferência |

### Lista de conferir (checklist)
- **Caixa de marcar** em cada linha:
  - *manual*: caixa vermelha;
  - *automática* (bateu sozinho): caixa cinza e desabilitada; para remover, só pela Auditoria.
- **Ao marcar:** a caixa dá um "pulo", o nome é **riscado com animação**, a linha **fica apagada** e **desce para o fim** da lista.
- **Filtro "Situação":** Todas / Pendentes / Conferidos (ou Corrigidos).
- **Histórico:** marcar e desmarcar o mesmo item **no mesmo minuto** não fica registrado.

### "Fora do padrão"
- **Padrão pela maioria** dos dados (ex.: o lançamento mais usado naquele CFOP) **ou** pelo **cadastro**, quando existe regra fixa.
- **Agrupado por "dono" do padrão:** CFOP/natureza nas notas fiscais, fornecedor/cliente nos serviços.
  - Cada grupo é recolhível e tem caixa para marcar o grupo inteiro, a quantidade, o esperado e o total.
  - Os grupos pendentes ficam abertos. Os corrigidos vão para a seção **"Corrigidos (N)"**, recolhidos.
  - **"Ordenar por"** fica no título: nome (A-Z) · valor · data.
- **Cada nota mostra:** data · número · o que veio · o que era esperado · valor.
- **Correção num clique:** quando o valor usado pertence a outra categoria, a linha oferece "Colocar em X", que abre o cadastro já preenchido.

---

## 6. Revisão de uma conta (verificar com relatório externo)

1. **Entrada:** o ícone **Revisar** na tabela de conferência abre a tela com a **conta já escolhida**.
2. **Formulário:**
   - conta (travada);
   - de onde vêm os dados: CFOP, ou "Notas conferidas" quando não há CFOP;
   - arquivo do relatório (lido assim que é escolhido);
   - **Conferir**.
3. **Resultado:**
   - O formulário **some**.
   - No topo, um **resumo** com a conta em destaque (código + nome + origem) e os três números **Relatório · Notas · Diferença**. Sem repetir totais que já aparecem embaixo.
   - Aparece uma **caixa "Pendências"**, só com as seções que têm itens: **Faltando na conta · Duplicadas na conta · A mais na conta**. Cada seção tem título com a quantidade e o total, sem frase explicativa.
   - Todas as seções usam as **mesmas colunas: Data · Nota · Participante · Contrapartida (só o número) · Valor**. O histórico completo do relatório fica no *hover*. O CSV usa as mesmas colunas.
   - Embaixo, à direita: **Baixar resultado** + **Corrigi, quero reconferir**. Esse botão escolhe o arquivo novo e já confere de novo.
4. **Sem pendência:**
   - Se veio de **Corrigi, quero reconferir**, aparece o **aviso de sucesso** por cima da tela: check verde, **"Tudo certo!"**, a conta e que ela ficou **Ok**, botão **Ok**.
   - O botão **Corrigi, quero reconferir** vira **Ok**, que volta para o Relatório.
   - A conta fica **Ok** automaticamente na tabela.
   - Se depois voltarem pendências, o Ok sai sozinho.
5. **Seguir com pendência:**
   - O botão **"Marcar como conferido"** fica no canto da caixa de pendências.
   - Marcado, vira **"Conferido"** laranja; clicar de novo desfaz.
   - Na tabela, a conta mostra **Conferido**.
6. **O arquivo nunca é salvo.** Sair da tela descarta o relatório e o resultado.
7. **Auditoria:** registra Ok, Conferido e Desfeito.

---

## 7. Consulta (lista pesquisável)

- **Abas:** **Todos** (primeira e padrão) + uma por tipo. Em Todos aparece a coluna **Tipo**, com bolinha de cor.
- **Busca dentro da caixa da tabela:** campo de busca + Período (de/até) + Filtrar + **Limpar**, que só aparece quando há filtro. Tudo com a **mesma altura**. Enter pesquisa.
- **Resumo logo abaixo:** "**246** notas · **495.328,29**". Com filtro, fica "**28** notas de 246 · …".
- **Tabela:**
  - clique no cabeçalho ordena (▲▼);
  - nome numa linha só, com "…" e nome completo no *hover*;
  - colunas de apoio em cinza;
  - mostra até 400 linhas, com aviso para refinar ou baixar o CSV.
- **CSV:** separador `;`, BOM para o Excel, decimal com vírgula, e respeita o filtro atual.

---

## 8. Resumos e visualização

- **Resumido / Detalhado:** seletor abaixo do título.
  - *Resumido* (padrão) mostra só o que se usa no dia a dia.
  - *Detalhado* acrescenta gráficos e grades.
  - A escolha fica **guardada no navegador** de cada pessoa.
- **Resumo em lista:** uma linha por item, colunas alinhadas (Arquivo · Período · Meses · Quantidade · Valor), bolinha de cor por tipo e período curto ("05/01 – 28/08/2026").
- **Avisos acima dos detalhes:** meses sem dado dentro do período e períodos que não coincidem. Se está tudo certo, uma faixa verde curta.
- **Grade de cobertura:** um quadrado por mês. A intensidade da cor mostra a quantidade, o contorno tracejado mostra mês sem dado e o *hover* mostra os números.
- **Gráficos:** barras simples com legenda. As cores seguem os tipos.

---

## 9. Histórico (Auditoria)

- **Uma lista única**, do mais novo para o mais antigo, com Data/hora · Tipo · Ação · Detalhe · Origem (Manual/Automático).
- **Registra:** importações e exclusões, conferências marcadas e desmarcadas, correções "fora do padrão" e revisões de conta.
- **Mesmo minuto:** marcar e desmarcar a mesma coisa no mesmo minuto se anula e não aparece.

---

## 10. Retorno ao usuário

| Situação | Componente |
|---|---|
| Algo foi salvo ou alterado | **Toast** curto (some em ~3,6 s) |
| Ação que não dá para desfazer (apagar, sobrepor) | **Modal** com ícone, título em pergunta, texto com números em negrito, **Voltar** + ação |
| Opção ligada que exige preencher campos (ex.: Vendas à vista e a prazo) | Os campos viram **obrigatórios**: tentar sair (outra aba, menu, Início) abre o **modal "Preencha os lançamentos"** com quantos faltam, e os botões vazios ficam **em vermelho** (`.vista-add.vista-falta`). Fechar a janela do navegador também pede confirmação. Desligar a opção libera. |
| Fim de uma correção que deu certo (reconferência sem pendência) | **Modal de sucesso** (`tom:'ok'`): check verde grande, título curto ("Tudo certo!"), uma frase, só **Ok** |
| Erro ou atenção dentro de um card | **Alerta** (ícone + título + texto) |
| Deu certo e precisa ficar visível | Alerta **verde** ou faixa curta |
| Sem dado | **Vazio** curto em cinza, dizendo o que falta |
| Processando | Botão com **spinner** e texto no gerúndio |

---

## 11. Tema e preferências

- **Tema:** claro / escuro / **sistema** (padrão), guardado no navegador. Todas as cores são variáveis CSS, e o tema só troca os valores.
- **Preferências de quem está usando** (tema, barra lateral oculta, Resumido/Detalhado) ficam no **navegador**.
- **Regras da empresa** (chaves On/Off, cadastros, conferências) ficam no **banco**, iguais para todos.

---

## 12. Formatos

| Tipo | Formato |
|---|---|
| Valor | `1.234,56` (pt-BR, 2 casas); negativo com `-` |
| Data | `dd/mm/aaaa`; campos de data com máscara automática |
| Mês | `jan/26` em grades, `Jan/26` em gráficos |
| Códigos | como vêm do sistema de origem (ex.: `00215`); comparação ignora zeros à esquerda |
| Nomes | comparação sem acento, maiúscula ou espaço duplo (normalizada) |
| CSV | `;` + BOM + vírgula decimal |

---

## 13. Checklist ao criar uma tela nova

- [ ] Usa o esqueleto: título + ações no canto direito + seletor interno abaixo do título?
- [ ] Tem só **uma** ação principal vermelha na área?
- [ ] Textos explicativos só onde evitam erro?
- [ ] Caixas e linhas vazias estão escondidas?
- [ ] Números em `class="num"`, formato pt-BR?
- [ ] Estados visíveis: vazio, carregando, sucesso, erro, travado?
- [ ] Ações destrutivas com modal de confirmação?
- [ ] Ações importantes vão para o histórico?
- [ ] Funciona no tema claro **e** escuro? E no celular (sem rolagem lateral)?
- [ ] Botões só de ícone têm `title` e `aria-label`?
- [ ] Tamanhos iguais aos componentes do kit (não criou um tamanho novo)?
