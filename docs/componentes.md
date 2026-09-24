# Componentes

Catálogo das classes do `css/nilma.css`. Os exemplos ao vivo e o código pronto para copiar estão em `kit/nilma-ui-kit.html`. A lógica de uso de cada padrão está em `docs/padroes-de-uso.md`.

Ícones: `svg('nome')` em JS, ou `<i data-ico="nome"></i>` no HTML, trocado pelo `renderIcones()` (os dois vêm no `js/nilma.js`).

---

## Casca da aplicação

| Parte | Classes / ids | Observação |
|---|---|---|
| Cabeçalho | `.gh-header` › `.gh-header-top` (`.gh-hamb`, `.brand-mark`, `.gh-crumbs` › `.gh-crumb`, `.gh-sep`, `#brandTagEmpresa`) | O `title` do `#brandTagEmpresa` aparece como nome ao lado do código |
| Abas da seção | `nav.menu#menu` › `button.menu-item(.active)` | Montadas pelo `nilmaIniciar` |
| Gaveta ☰ | `.drawer-overlay`, `aside.drawer` › `.drawer-head`, `.drawer-item`, `.drawer-foot` | Tema fica no rodapé |
| Menu lateral | `.layout` › `nav.subnav` › `.subnav-itens` (`button.subnav-item`, `hr.subnav-sep`), `.subnav-foot` › `.subnav-colapsar` | `.layout.sidebar-oculta` = só ícones |
| Página | `main.main` › `header.topbar` (`h2.page-title`, `#topbarActions`) + `.content` › `section[data-view]` | Uma `section` por página |
| Entrada | `#login` › `.auth` › `.auth-mark`, `h1.auth-title`, `.auth-box` | Logo + título + busca |

## Ações

| Componente | Classes | Quando |
|---|---|---|
| Botão principal | `.btn.btn-primary` | Uma por área |
| Botão secundário | `.btn` / `.btn.btn-outline` | Filtrar, Baixar |
| Botão de apagar | `.btn.btn-danger` | Excluir (sempre com modal) |
| Botão pequeno | `+ .btn-sm` | Dentro de cards, linhas e formulários |
| Botão "fantasma" | `.btn.btn-ghost.btn-sm` | Voltar |
| Ação em texto | `.link-btn` | Reimportar, Limpar |
| Só ícone | `.icon-btn` (`.icon-btn-sm`, `.danger`) | Revisar, remover; sempre com `title` + `aria-label` |
| Carregando | `<span class="btn-spinner"></span>` + `disabled` | "Importando…" |
| Linha de botões | `.btn-row` | Alinhar à direita: `style="justify-content:flex-end"` |

## Campos

| Componente | Classes |
|---|---|
| Campo com rótulo | `.field` › `label` + `input[type=text]` |
| Seleção compacta | `select.select-compact` |
| Escolher arquivo | `label.file-picker(.has-file)` › ícone + `.file-picker-name` (+ `button.file-clear`) + `input[type=file].sr-only` |
| Linha de importação | `.import-box-row` (arquivo + botão) |
| Busca | `.gh-search` › `input` + `.gh-search-btn` (+ `.gh-search-clear`) |
| Data | `input.data-mask` (máscara dd/mm/aaaa no app) |
| Campo travado | `.locked` |
| Lista suspensa | `.table-wrap.scroll-list` › `.emp-list` › `button.emp-item` › (`.emp-cod`) `.emp-txt` › `.emp-nome` + `.emp-reg` |

## Seletores e chaves

| Componente | Classes | Comportamento |
|---|---|---|
| Seletor interno | `.steps` › `button.step-pill[aria-current="true"]` | Evento `nilma:seletor` |
| Chave On/Off | `.toggle-row` + `button.toggle-switch[role=switch][aria-checked]` › `.toggle-txt`, `.toggle-track` › `.toggle-knob` | Com `data-nilma-toggle`: evento `nilma:toggle` |
| Caixa de marcar | `input[type=checkbox]` (já estilizado); automático: `.chk-auto` + `disabled` | — |
| Tema | `.theme-toggle` › `button[data-theme-choice=light\|dark\|system]` | `applyTheme()` |

## Estrutura de conteúdo

| Componente | Classes |
|---|---|
| Card | `.card` › `h3` (ícone: `span.import-card-ico`), `.sub`, `.hint` |
| Título com controle | `.card-head` › `h3` + `label.card-head-ctl` |
| Painel | `.painel` › `.painel-head` › `.painel-titulo` + `.painel-sub` |
| Grade de 2 painéis | `.dash-grid` |
| Números | `.stat-grid` › `.stat` › `.stat-label` + `.stat-value` (`.cor-entrada`, `.cor-saida`; clicável: `.stat-clicavel`) |
| Resumo em lista | `.per-resumo` › `.per-linha(.per-head)` › `.per-nome` (`i.per-dot`), `.per-periodo`, `.per-num`, `.per-valor`, `.per-vazio` |
| Resumo de verificação | `.vc-resumo` › `.vc-resumo-conta` (`.vc-resumo-rot`, `.vc-resumo-nome`, `.vc-resumo-fonte`), `.vc-resumo-nums` › `.vc-num(.ok\|.bad)`, `.vc-resumo-comp` |
| Caixa de pendências | `.vc-pend` › `.vc-pend-head` (h3 + botão) + `.vc-secao` |

## Tabelas

| Componente | Classes |
|---|---|
| Contêiner | `.table-wrap` (cabeçalho fixo; `style="max-height:none"` para não rolar) |
| Número | `td.num` / `th.num` |
| Texto que quebra | `td.wrap` |
| Compacta | `table.table-compact` |
| Ordenável | `th.th-sort` › `span.th-sort-ico` (▲▼) |
| Situação | `.sit` › badge + `.icon-btn` ou `.sit-vazio` (espaço reservado) |
| Linha com erro | `tr.bad` |
| Conferido (riscado) | contêiner `#natLista` / `#natListaServ` + `tr.feito(.anima)` + `span.risco` |
| Caixa com busca | `.gh-box` › `.gh-box-head.cons-head` (`.gh-search.cons-busca`, `.gh-box-filters`) + `p.cons-resumo` + `table.cons-tabela` |
| Colunas de apoio | `.cons-mut` (cinza), `.cons-nome` (uma linha com "…"), `.cons-data` |

## Marcas visuais

| Componente | Classes |
|---|---|
| Badge | `.badge` + `.badge-ok` / `.badge-bad` / `.badge-neutral` / `.badge-conferido` |
| Conta vinculada | `.ndp-chip` (+ `button` ×) |
| Pílula de valor | `.vista-pill` › `.vista-pill-txt` (b) + `.vista-pill-x` |
| Pílula de adicionar | `button.vista-add` (tracejada) |
| Tipo com cor | `.cons-tipo` › `i` (bolinha) + texto |
| Filtros em linha | `.chip-row` › `.chip-lbl`, `.chip-sep`, `button.chip-f(.on)` |
| Cadeado | `span.serv-cadeado` › svg lock |

## Retorno ao usuário

| Componente | Classes / função |
|---|---|
| Alerta | `.alert` › svg + div (`.alert-title`, `.alert-text`); sucesso com as cores `--success-*` |
| Faixa ok | `.parity` |
| Toast | `toast('mensagem')` → `.toast-region` › `.toast` |
| Modal | `modal({icon,title,text,buttons})` → `.modal-overlay` › `.modal` |
| Modal de sucesso | `modal({tom:'ok',icon:'checkCircle',title,text,buttons})` → `.modal.modal-ok` (ícone verde 48px, tudo centralizado) |
| Vazio simples | `p.empty` |
| Vazio grande | `.gh-blank` › svg + h4 + p |

## Gráficos

| Componente | Classes |
|---|---|
| Barras | `.chart` › `.chart-col` › `.chart-plot` › `.chart-bar` + `.chart-lbl`; legenda `.chart-legend` › `i.chart-dot` |
| Cobertura mensal | `.per-grade[style="--n:meses"]` › `.per-mes`, `.per-lbl`, `.per-cel(.vazio\|.fora)` |
| Ranking | `.rank` › `button.rank-item` › `.rank-nome`, `.rank-val`, `.rank-barra` › span |
