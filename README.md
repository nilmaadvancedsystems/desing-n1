# design-n1 — Sistema de design Nilma

Visual, componentes e lógica de uso dos sistemas da **Nilma Contabilidade**, extraídos da Conferência Contábil ([conferencia-nilma.web.app](https://conferencia-nilma.web.app)). Serve para qualquer sistema novo do ecossistema ter a mesma cara e o mesmo comportamento.

Também é uma **skill do Claude Code** (`SKILL.md`): clonada em `.claude/skills/design-n1`, é usada sempre que alguém cria ou padroniza uma interface.

## Estrutura

```
design-n1/
├── SKILL.md                  instruções da skill (quando usar, como aplicar, regras)
├── templates/esqueleto.html  app pronto pra começar um sistema novo (arquivo único)
├── css/nilma.css             CSS do sistema (tokens claro/escuro + componentes)
├── js/nilma.js               ícones, toast, modal, tema, navegação (nilmaIniciar)
├── kit/
│   ├── nilma-ui-kit.html     galeria viva dos componentes, com código pra copiar
│   └── paginas.html          fonte das páginas do kit
├── docs/
│   ├── padroes-de-uso.md     lógica de cada padrão (o "como se comporta")
│   ├── componentes.md        catálogo de classes
│   └── tokens.md             cores claro × escuro (gerado)
└── scripts/montar.js         regenera tudo a partir do app de referência
```

## Começar um sistema novo

1. Copie `templates/esqueleto.html` e abra no navegador. Já funciona.
2. Troque o nome e as seções em `nilmaIniciar({ secoes: [...] })`.
3. Para cada página, crie `<section data-view="id" hidden>…</section>`.
4. Monte o conteúdo com os componentes do `kit/nilma-ui-kit.html` (botão **Código** em cada exemplo).
5. Siga `docs/padroes-de-uso.md` e o checklist do final.

## Atualizar a partir da Conferência

```bash
node scripts/montar.js caminho/para/conferencia.html
```

Isso regera `css/nilma.css`, `js/nilma.js`, `kit/nilma-ui-kit.html`, `templates/esqueleto.html` e `docs/tokens.md`.
