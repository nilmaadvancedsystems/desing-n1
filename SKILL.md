---
name: design-n1
description: Sistema de design interno da Nilma (N1). Visual, componentes e lógica de uso das telas, tirados da Conferência Contábil (conferencia-nilma.web.app). Use SEMPRE que for criar, redesenhar, padronizar ou revisar a interface (HTML/CSS/JS) de qualquer sistema do ecossistema Nilma/Vitor. Também quando o usuário pedir "no padrão Nilma", "mesma cara da Conferência", "design-n1", "padroniza a UI", "tela nova", "componente", "kit", ou quando começar um app HTML novo para o escritório.
---

# design-n1 — Sistema de design Nilma

Tudo o que é preciso para um sistema novo ter **a mesma cara e o mesmo comportamento** da Conferência Contábil. A Conferência é a referência viva: quando ela muda, esta skill é regenerada a partir dela.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `templates/esqueleto.html` | **Comece por aqui.** App de arquivo único, já funcionando: cabeçalho, abas, menu lateral, gaveta ☰, tema, toast, modal e 3 seções de exemplo |
| `css/nilma.css` | O CSS inteiro do sistema (tokens claro/escuro + todos os componentes) |
| `js/nilma.js` | Ícones (`ICONS`, `svg()`, `renderIcones()`), `toast()`, `modal()`, `applyTheme()`, `brl()`, `esc()` e `nilmaIniciar()` (navegação) |
| `kit/nilma-ui-kit.html` | Galeria viva de todos os componentes, com o código pronto para copiar |
| `docs/padroes-de-uso.md` | **A lógica**: como cada padrão se comporta (navegação, importação, cadastro, conferência, revisão, consulta, resumos, histórico, retorno, formatos) + checklist |
| `docs/componentes.md` | Catálogo de classes, por componente |
| `docs/tokens.md` | Tabela de cores claro × escuro (gerada) |
| `kit/paginas.html` | Fonte das páginas do kit (editar aqui para mudar o kit) |
| `scripts/montar.js` | Regenera css/js/kit/template/tokens a partir do app de referência |

## Como aplicar num projeto

1. **App novo:** copie `templates/esqueleto.html`, troque o nome do sistema e as `secoes` do `nilmaIniciar({...})`, e crie uma `<section data-view="…" hidden>` por página.
2. **App existente:** cole o `css/nilma.css` no `<style>` e o `js/nilma.js` no `<script>`. Troque o markup pelos componentes do kit, sem inventar classe nova quando já existe uma.
3. **Leia `docs/padroes-de-uso.md` antes de desenhar o comportamento.** As regras que mais importam:
   - menu lateral abre a 1ª página e a 1ª aba; as abas de cima voltam onde a pessoa parou;
   - ações da página no canto superior direito; seletor interno logo abaixo do título;
   - uma ação principal por área; excluir sempre com modal;
   - só mostrar caixa ou linha que tem conteúdo; sem texto explicativo à toa;
   - importação: popup "apenas novas / sobrepor", mensagem flutuante de 3,7 s, depois Reimportar + Excluir;
   - conferência: marcar risca, apaga a linha e manda para o fim; filtro Situação; tudo no histórico;
   - revisão: resultado esconde o formulário; Reimportar sem pendência vira Ok; "Marcar como conferido" com desfazer.
4. **Antes de entregar:** passe o checklist do fim de `docs/padroes-de-uso.md`. Teste nos temas claro e escuro e numa largura estreita (sem rolagem lateral).

## Regras desta skill

- **Padronizar ≠ redesenhar.** Quando pedirem para padronizar, só alinhe ao que já existe no kit (tamanho, fonte, espaçamento, cor). Não mude layout.
- **Cor pelo significado**, sempre por `var(--token)`: laranja = entrada/diferença/atenção, verde = saída/ok, vermelho da marca = ação principal.
- **Textos em português**, curtos, sem explicar o óbvio. Números em pt-BR (`1.234,56`) com `class="num"`.
- **Ícones SVG** do mapa `ICONS` (traço 1,75). Nada de emoji como ícone. Botão só de ícone sempre com `title` e `aria-label`.
- **Preferência de quem usa** (tema, barra lateral, Resumido/Detalhado) fica no `localStorage`. **Regra da empresa** fica no banco.

## Como manter atualizado

Quando um padrão mudar num app (a Conferência é a referência):

1. Regenere: `node scripts/montar.js <caminho>/conferencia.html` (atualiza css, js, kit, template e tokens).
2. Se entrou componente novo, acrescente um exemplo em `kit/paginas.html` (bloco `<div class="kit-demo">`) e rode o script de novo.
3. Se mudou comportamento, atualize `docs/padroes-de-uso.md`. Se mudou classe, atualize `docs/componentes.md`.
4. Commit e push neste repositório (`nilmaadvancedsystems/desing-n1`). Esta pasta é o clone.
