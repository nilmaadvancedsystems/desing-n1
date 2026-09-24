#!/usr/bin/env node
/* design-n1 — monta o sistema de design a partir de um app de referência.
   Uso:  node scripts/montar.js <caminho/do/app-referencia.html>
   Ex.:  node scripts/montar.js ../../../../conferencia.html

   Lê do app: o <style> inteiro, o mapa ICONS (+ ICONS.x=…), a função svg(), o logo e a versão.
   Gera:
     css/nilma.css              — o CSS do sistema, igual ao app
     js/nilma.js                — ícones, svg(), toast, modal, tema, navegação, gaveta, barra lateral
     kit/nilma-ui-kit.html      — galeria de componentes (usa kit/paginas.html)
     templates/esqueleto.html   — tela inicial pronta pra um sistema novo (arquivo único)
     docs/tokens.md             — tabela de cores (claro × escuro) */
const fs=require("fs"),path=require("path");
const RAIZ=path.resolve(__dirname,"..");
const origem=process.argv[2];
if(!origem){console.error("Informe o HTML de referência: node scripts/montar.js <app.html>");process.exit(1);}
const app=fs.readFileSync(origem,"utf8");
const escrever=(rel,txt)=>{const p=path.join(RAIZ,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,txt);console.log("  "+rel+"  ("+(txt.length/1024).toFixed(0)+" KB)");};

/* ---------- peças do app ---------- */
const css=app.slice(app.indexOf("<style>")+7,app.indexOf("</style>")).replace(/^\n+|\s+$/g,"")+"\n";
const favicon=app.match(/<link rel="icon"[^>]*>/)[0];
const i0=app.indexOf("var ICONS = {"),i1=app.indexOf("};",i0)+2;
const icones=app.slice(i0,i1)+"\n"+(app.match(/^ICONS\.[a-zA-Z]+=.*$/gm)||[]).join("\n");
const svgFn=app.match(/^function svg\(n,extra\)\{.*\}$/m)[0];
const logoPaths=app.match(/<svg viewBox="0 0 720 1176">(<path fill="url\(#nlRed\)"[^>]*\/><path fill="url\(#nlSilver\)"[^>]*\/>)<\/svg>/)[1];
const versao=(app.match(/var APP_VERSION='([^']+)'/)||[])[1]||"";
const escHtml=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* ---------- js/nilma.js ---------- */
const nilmaJs=`/* =====================================================================
   Nilma UI (design-n1) — JS base
   Ícones, svg(), renderIcones(), toast(), modal(), tema claro/escuro/sistema,
   navegação (menu lateral + abas), gaveta ☰, ocultar barra lateral e seletor interno.
   Início rápido:
     nilmaIniciar({
       secoes:[{id:'importacao',grupo:1,label:'Importação',icon:'upload',
                itens:[{v:'imp-arquivo',label:'Arquivo',icon:'fileText'}]}],
       inicial:'imp-arquivo',
       aoAbrir:function(v,info){ ...desenhar a página v... }
     });
   Cada página é um <section data-view="v" hidden> dentro de .content.
   ===================================================================== */
${icones}
${svgFn}
// troca <i data-ico="nome"></i> pelo ícone
function renderIcones(root){
  [].slice.call((root||document).querySelectorAll('i[data-ico]')).forEach(function(i){
    var t=document.createElement('span');t.innerHTML=svg(i.getAttribute('data-ico'));
    i.parentNode.replaceChild(t.firstChild,i);
  });
}
// mensagem curta no canto (some em ~3,6 s) — precisa de <div class="toast-region" id="toastRegion">
function toast(m){
  var r=document.getElementById('toastRegion');if(!r)return;
  var t=document.createElement('div');t.className='toast';t.textContent=m;
  r.appendChild(t);setTimeout(function(){t.remove();},3600);
}
// confirmação — modal({icon,title,text(HTML),buttons:[{label,value,variant}]}).then(valor=>…)
function modal(o){
  return new Promise(function(res){
    var ov=document.getElementById('modalOverlay');
    document.getElementById('modalIcon').innerHTML=svg(o.icon||'alert');
    ov.querySelector('.modal').classList.toggle('modal-ok',o.tom==='ok');
    document.getElementById('modalTitle').textContent=o.title;
    document.getElementById('modalText').innerHTML=o.text||'';
    var a=document.getElementById('modalActions');a.innerHTML='';
    (o.buttons||[{label:'Ok',value:true,variant:'btn-primary'}]).forEach(function(b){
      var btn=document.createElement('button');
      btn.type='button';btn.className='btn '+(b.variant||'btn-outline');btn.textContent=b.label;
      btn.onclick=function(){ov.hidden=true;res(b.value);};
      a.appendChild(btn);
    });
    ov.hidden=false;
    var f=a.querySelector('button');if(f)f.focus();
  });
}
// tema: 'light' | 'dark' | 'system' (guardado no navegador)
var NILMA_TEMA='nilma-theme';
function applyTheme(c){
  if(c==='light'||c==='dark')document.documentElement.setAttribute('data-theme',c);
  else{c='system';document.documentElement.removeAttribute('data-theme');}
  try{localStorage.setItem(NILMA_TEMA,c);}catch(e){}
  [].slice.call(document.querySelectorAll('.theme-toggle button')).forEach(function(b){b.classList.toggle('active',b.dataset.themeChoice===c);});
}
(function(){var s='system';try{s=localStorage.getItem(NILMA_TEMA)||'system';}catch(e){}applyTheme(s);})();
// formato brasileiro
function brl(n){return Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- navegação e casca do app ----------
   Regras (design-n1):
   - menu lateral = seções fixas; clicar abre SEMPRE a 1ª página da seção, na 1ª aba interna;
   - abas de cima = páginas da seção; voltam onde a pessoa parou;
   - seletor interno (.steps .step-pill) marca aria-current e dispara o evento 'nilma:seletor';
   - chave (.toggle-switch[data-nilma-toggle]) alterna On/Off e dispara 'nilma:toggle'. */
function nilmaIniciar(op){
  op=op||{};
  var $=function(s){return document.querySelector(s);},$$=function(s){return [].slice.call(document.querySelectorAll(s));};
  var secoes=op.secoes||[],atual=null;
  function secDe(v){return secoes.filter(function(s){return s.itens.some(function(i){return i.v===v;});})[0]||secoes[0];}
  function renderNav(){
    var sec=secDe(atual),ant=null;
    if($('#subnavItens'))$('#subnavItens').innerHTML=secoes.map(function(s){
      var on=s.id===sec.id,sep=ant!==null&&s.grupo!==ant?'<hr class="subnav-sep">':'';ant=s.grupo;
      return sep+'<button type="button" class="subnav-item'+(on?' active':'')+'" data-sec="'+s.id+'"'+(on?' aria-current="page"':'')+' title="'+esc(s.label)+'">'+svg(s.icon)+'<span>'+esc(s.label)+'</span></button>';
    }).join('');
    if($('#menu'))$('#menu').innerHTML=sec.itens.map(function(i){
      var on=i.v===atual;
      return '<button type="button" class="menu-item'+(on?' active':'')+'" data-ir="'+i.v+'"'+(on?' aria-current="page"':'')+'>'+svg(i.icon)+'<span>'+esc(i.label)+'</span></button>';
    }).join('');
    var it=sec.itens.filter(function(i){return i.v===atual;})[0];
    if($('#pageTitle'))$('#pageTitle').textContent=it?(it.titulo||it.label):'';
  }
  function go(v,info){
    if(!document.querySelector('[data-view="'+v+'"]'))v=secoes[0].itens[0].v;
    atual=v;
    $$('[data-view]').forEach(function(s){s.hidden=s.dataset.view!==v;});
    if(info&&info.lateral){ // 1ª aba interna da página
      var st=document.querySelector('[data-view="'+v+'"] .steps');
      if(st&&st.firstElementChild)selecionar(st.firstElementChild);
    }
    renderNav();window.scrollTo({top:0});
    if(op.hash!==false){try{history.replaceState(null,'','#'+v);}catch(e){}}
    if(op.aoAbrir)op.aoAbrir(v,info||{});
  }
  function selecionar(b){
    [].slice.call(b.parentNode.children).forEach(function(x){x.setAttribute('aria-current',x===b?'true':'false');});
    b.parentNode.dispatchEvent(new CustomEvent('nilma:seletor',{bubbles:true,detail:{valor:b.dataset.valor||b.textContent.trim(),botao:b}}));
  }
  function gaveta(abrir){if($('#drawer')){$('#drawer').hidden=!abrir;$('#drawerOverlay').hidden=!abrir;}}
  document.addEventListener('click',function(e){
    var b=e.target.closest('#subnav [data-sec]');
    if(b){var s=secoes.filter(function(x){return x.id===b.dataset.sec;})[0];if(s)go(s.itens[0].v,{lateral:true});return;}
    b=e.target.closest('[data-ir]');if(b){go(b.dataset.ir,{aba:true});return;}
    b=e.target.closest('[data-theme-choice]');if(b){applyTheme(b.dataset.themeChoice);return;}
    b=e.target.closest('.steps .step-pill');if(b&&!b.disabled&&!b.classList.contains('is-locked')){selecionar(b);return;}
    b=e.target.closest('.toggle-switch[data-nilma-toggle]');
    if(b){var on=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',on);var t=b.querySelector('.toggle-txt');if(t)t.textContent=on?'On':'Off';
      b.dispatchEvent(new CustomEvent('nilma:toggle',{bubbles:true,detail:{on:on}}));return;}
    if(e.target.closest('#btMenuHamb')){gaveta(true);return;}
    if(e.target.closest('#btDrawerFechar,#drawerOverlay')){gaveta(false);return;}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')gaveta(false);});
  var SB='nilma-sidebar-oculta';
  function barra(o){
    var l=$('.layout'),bt=$('#btColapsar');if(!l||!bt)return;
    l.classList.toggle('sidebar-oculta',o);bt.setAttribute('aria-expanded',o?'false':'true');
    bt.title=o?'Mostrar barra lateral':'Ocultar barra lateral';var sp=bt.querySelector('span');if(sp)sp.textContent=bt.title;
    try{localStorage.setItem(SB,o?'1':'0');}catch(e){}
  }
  if($('#btColapsar')){$('#btColapsar').onclick=function(){barra(!$('.layout').classList.contains('sidebar-oculta'));};
    var o=false;try{o=localStorage.getItem(SB)==='1';}catch(e){}barra(o);}
  function altura(){var h=$('.gh-header');if(h)document.documentElement.style.setProperty('--hdr-h',h.offsetHeight+'px');}
  window.addEventListener('resize',altura);
  renderIcones();
  var ini=(op.hash!==false&&location.hash.slice(1))||op.inicial||(secoes[0]&&secoes[0].itens[0].v);
  if(ini)go(ini);
  altura();
  return {go:go,atual:function(){return atual;},renderNav:renderNav};
}
`;

/* ---------- casca (cabeçalho, gaveta, menu lateral, topo, modal, toast) ---------- */
const logo='<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 720 1176"><use href="#nlLogo"/></svg></span>';
const defs=`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="nlRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8F2429"/><stop offset=".45" stop-color="#D8323A"/><stop offset="1" stop-color="#93262B"/></linearGradient>
  <linearGradient id="nlSilver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E6E73"/><stop offset=".5" stop-color="#D4D4D8"/><stop offset="1" stop-color="#7A7A7F"/></linearGradient>
  <g id="nlLogo">${logoPaths}</g>
</defs></svg>`;
function casca(o){
  return `<div id="app">
  <header class="gh-header">
    <div class="gh-header-top">
      <button class="gh-hamb" id="btMenuHamb" type="button" aria-label="Abrir menu" title="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
      ${logo}
      <nav class="gh-crumbs" aria-label="Local">
        <button class="gh-crumb" id="crumbInicio" type="button">${o.sistema}</button>
        <span class="gh-sep">/</span>
        <button class="brand-tag" id="brandTagEmpresa" type="button" title="${o.tagTitulo}">${o.tag}</button>
      </nav>
    </div>
    <nav class="menu" id="menu" aria-label="Páginas da seção"></nav>
  </header>

  <div class="drawer-overlay" id="drawerOverlay" hidden></div>
  <aside class="drawer" id="drawer" aria-label="Menu" hidden>
    <div class="drawer-head">
      ${logo}
      <button class="drawer-x" id="btDrawerFechar" type="button" aria-label="Fechar menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <button class="drawer-item" id="btDrawerInicio" type="button"><i data-ico="home"></i>Início</button>
    <div class="drawer-foot">
      <div class="theme-toggle" role="group" aria-label="Tema">
        <button type="button" data-theme-choice="light" aria-label="Tema claro" title="Claro"><i data-ico="sun"></i></button>
        <button type="button" data-theme-choice="dark" aria-label="Tema escuro" title="Escuro"><i data-ico="moon"></i></button>
        <button type="button" data-theme-choice="system" aria-label="Seguir o sistema" title="Sistema"><i data-ico="monitor"></i></button>
      </div>
      <p>${o.rodape}</p>
    </div>
  </aside>

  <div class="layout">
  <nav class="subnav" id="subnav" aria-label="Seções">
    <div class="subnav-itens" id="subnavItens"></div>
    <div class="subnav-foot">
      <button type="button" class="subnav-item subnav-colapsar" id="btColapsar" aria-expanded="true" title="Ocultar barra lateral">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="m16 10-2 2 2 2"/></svg><span>Ocultar barra lateral</span>
      </button>
    </div>
  </nav>
  <main class="main">
    <header class="topbar">
      <div><h2 class="page-title" id="pageTitle"></h2></div>
      <div id="topbarActions" style="display:flex;gap:8px;flex-wrap:wrap;">${o.acoes||''}</div>
    </header>
    <div class="content">
${o.conteudo}
    </div>
  </main>
  </div>
</div>

<div class="modal-overlay" id="modalOverlay" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-icon" id="modalIcon"></div>
    <h3 id="modalTitle"></h3>
    <p id="modalText"></p>
    <div class="modal-actions" id="modalActions"></div>
  </div>
</div>
<div class="toast-region" id="toastRegion" aria-live="polite"></div>`;
}
const pagina=o=>`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${o.titulo}</title>
${favicon}
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- design-n1 · css/nilma.css -->
<style id="nilma-css">
${css}  #app{display:block;}
</style>
${o.cssExtra?"<style>"+o.cssExtra+"</style>":""}
</head>
<body>
${defs}

${casca(o)}

<script>
/* design-n1 · js/nilma.js */
${nilmaJs}
</script>
<script>
${o.js}
</script>
</body>
</html>
`;

/* ---------- esqueleto (código de exemplo mostrado no kit) ---------- */
const esqueletoTxt=`<!-- design-n1: comece por templates/esqueleto.html (já vem com tudo isso funcionando) -->
<header class="gh-header">            <!-- ☰ + logo + trilha "Sistema / Empresa" -->
  <div class="gh-header-top">…</div>
  <nav class="menu" id="menu"></nav>  <!-- abas da seção (montadas pelo nilmaIniciar) -->
</header>
<aside class="drawer" id="drawer" hidden>…tema claro/escuro/sistema…</aside>
<div class="layout">
  <nav class="subnav" id="subnav">    <!-- seções fixas (montadas pelo nilmaIniciar) -->
    <div class="subnav-itens" id="subnavItens"></div>
    <div class="subnav-foot"><button class="subnav-item subnav-colapsar" id="btColapsar">…</button></div>
  </nav>
  <main class="main">
    <header class="topbar">
      <div><h2 class="page-title" id="pageTitle"></h2></div>
      <div id="topbarActions"><!-- ações da página (canto superior direito) --></div>
    </header>
    <div class="content">
      <section data-view="imp-arquivo" hidden>
        <div class="steps">…seletor interno (logo abaixo do título)…</div>
        <div class="card">…</div>
      </section>
    </div>
  </main>
</div>
<script>
nilmaIniciar({
  secoes:[
    {id:'importacao',grupo:1,label:'Importação',icon:'upload',
     itens:[{v:'imp-arquivo',label:'Arquivo',icon:'fileText'},{v:'imp-periodos',label:'Períodos',icon:'calendar'}]},
    {id:'movimento',grupo:2,label:'Movimento',icon:'repeat',
     itens:[{v:'mov-conferencia',label:'Conferência',icon:'checkCircle'}]}
  ],
  inicial:'imp-arquivo',
  aoAbrir:function(v,info){ /* desenhar a página v */ }
});
</script>`;

/* ---------- kit ---------- */
const kitPaginas=fs.readFileSync(path.join(RAIZ,"kit/paginas.html"),"utf8");
const kitCss=`
  /* ================= só do kit (documentação) ================= */
  [data-view] .card{margin-bottom:16px;}
  .kit-demo > .card:last-child{margin-bottom:0;}
  .kit-code{margin:10px 0 16px;border:1px solid var(--border);border-radius:6px;background:var(--surface-2);}
  .kit-code summary{cursor:pointer;padding:7px 12px;font-size:12px;color:var(--ink-muted);user-select:none;}
  .kit-code summary:hover{color:var(--ink);}
  .kit-code-bar{display:flex;justify-content:flex-end;padding:0 8px 6px;}
  .kit-code pre{margin:0;padding:12px;overflow:auto;max-height:340px;font-family:var(--font-num);font-size:12px;line-height:1.55;color:var(--ink);border-top:1px solid var(--border);white-space:pre;}
  .kit-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;}
  .kit-sw{border:1px solid var(--border);border-radius:6px;overflow:hidden;cursor:pointer;background:var(--surface);text-align:left;padding:0;font:inherit;color:inherit;}
  .kit-sw:hover{border-color:var(--border-strong);}
  .kit-sw-cor{height:44px;border-bottom:1px solid var(--border);}
  .kit-sw-txt{padding:6px 10px;font-size:12px;color:var(--ink-muted);}
  .kit-sw-txt b{display:block;font-family:var(--font-num);font-weight:500;color:var(--ink);}
  .kit-icons{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;}
  .kit-ico{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font:inherit;font-size:12px;color:var(--ink);}
  .kit-ico:hover{background:var(--hover-bg);}
  .kit-ico svg{width:20px;height:20px;}
  .kit-mono{font-family:var(--font-num);font-size:12px;}
  .kit-dot{display:inline-block;margin-right:8px;vertical-align:1px;}
  .kit-lista{margin:0 0 12px;padding-left:18px;line-height:1.7;}
  .kit-check{display:inline-flex;align-items:center;gap:8px;font-size:14px;}
  .kit-frame{border:1px dashed var(--border);border-radius:6px;padding:24px 12px;background:var(--bg);}
  .kit-frame .auth{margin:0 auto;}
`;
const kitSecoes=[
  {id:'fundamentos',grupo:1,label:'Fundamentos',icon:'scale',itens:[{v:'cores',label:'Cores',icon:'sun'},{v:'tipografia',label:'Tipografia',icon:'fileText'},{v:'icones',label:'Ícones',icon:'list'}]},
  {id:'estrutura',grupo:1,label:'Estrutura',icon:'home',itens:[{v:'estrutura',label:'Esqueleto',icon:'home'},{v:'login',label:'Entrada',icon:'lock'}]},
  {id:'componentes',grupo:2,label:'Componentes',icon:'settings',itens:[{v:'botoes',label:'Botões',icon:'plus'},{v:'campos',label:'Campos',icon:'search'},{v:'chaves',label:'Chaves',icon:'check'},{v:'cards',label:'Cards',icon:'landmark'},{v:'tabelas',label:'Tabelas',icon:'list'},{v:'badges',label:'Badges',icon:'checkCircle'},{v:'avisos',label:'Avisos',icon:'alert'},{v:'listas',label:'Listas',icon:'repeat'}]},
  {id:'padroes',grupo:3,label:'Padrões',icon:'barChart',itens:[{v:'importacao',label:'Importação',icon:'upload'},{v:'resumo',label:'Resumos',icon:'scale'},{v:'graficos',label:'Gráficos',icon:'barChart'}]}
];
const kitJs=`(function(){
  var $=function(s){return document.querySelector(s);},$$=function(s){return [].slice.call(document.querySelectorAll(s));};
  var copiar=function(txt,msg){
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast(msg||'Copiado.');},function(){
      var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(msg||'Copiado.');}catch(e){}ta.remove();
    });
  };
  // código de cada exemplo (antes de trocar os ícones)
  $$('.kit-demo').forEach(function(d){
    var linhas=d.innerHTML.replace(/^\\s*\\n|\\s+$/g,'').split('\\n');
    var ind=Math.min.apply(null,linhas.filter(function(l){return l.trim();}).map(function(l){return l.match(/^ */)[0].length;}));
    var cod=linhas.map(function(l){return l.slice(ind);}).join('\\n').trim();
    var det=document.createElement('details');det.className='kit-code';
    det.innerHTML='<summary>Código</summary><div class="kit-code-bar"><button type="button" class="btn btn-sm">Copiar</button></div><pre><code>'+esc(cod)+'</code></pre>';
    det.querySelector('button').onclick=function(){copiar(cod,'Código copiado.');};
    d.parentNode.insertBefore(det,d.nextSibling);
  });
  $('#kitCodigoEsqueleto').textContent=${JSON.stringify(esqueletoTxt).replace(/</g,"\\u003c")};
  // cores (tokens do :root, valor do tema atual)
  var cssTxt=$('#nilma-css').textContent,ini=cssTxt.indexOf(':root{'),raiz=cssTxt.slice(ini,cssTxt.indexOf('}',ini));
  var nomes=(raiz.match(/--[a-z0-9-]+(?=\\s*:)/g)||[]).filter(function(n,i,l){return l.indexOf(n)===i;});
  var cs=getComputedStyle(document.documentElement);
  $('#kitSwatches').innerHTML=nomes.filter(function(n){return /^(#|rgb|hsl)/i.test(cs.getPropertyValue(n).trim());}).map(function(n){
    return '<button type="button" class="kit-sw" data-copia="var('+n+')"><div class="kit-sw-cor" style="background:var('+n+')"></div><div class="kit-sw-txt"><b>'+n+'</b><span data-var="'+n+'"></span></div></button>';
  }).join('');
  function valores(){var c=getComputedStyle(document.documentElement);$$('[data-var]').forEach(function(s){s.textContent=c.getPropertyValue(s.dataset.var).trim();});}
  valores();new MutationObserver(valores).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  if(window.matchMedia)window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',valores);
  // ícones
  $('#kitIcons').innerHTML=Object.keys(ICONS).sort().map(function(n){return '<button type="button" class="kit-ico" data-copia="'+n+'">'+svg(n)+'<span>'+n+'</span></button>';}).join('');
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copia]');if(b){copiar(b.dataset.copia,'Copiado: '+b.dataset.copia);return;}
    if(e.target.closest('[data-kit-toast]')){toast('Lançamento à vista: 0001.');return;}
    if(e.target.closest('[data-kit-modal]')){modal({icon:'alert',title:'Apagar o balancete?',text:'As <b>163 contas lidas</b> desta empresa serão removidas.',buttons:[{label:'Voltar',value:false,variant:'btn-outline'},{label:'Apagar',value:true,variant:'btn-primary'}]}).then(function(ok){toast(ok?'Apagado (exemplo).':'Nada foi alterado.');});}
  });
  $('#btCopiarCss').onclick=function(){copiar($('#nilma-css').textContent,'CSS do sistema copiado.');};
  var nav=nilmaIniciar({secoes:${JSON.stringify(kitSecoes)},inicial:'cores'});
  $('#crumbInicio').onclick=function(){nav.go('cores');};
  $('#btDrawerInicio').onclick=function(){$('#drawer').hidden=true;$('#drawerOverlay').hidden=true;nav.go('cores');};
})();`;

/* ---------- template: esqueleto de um sistema novo ---------- */
const tplConteudo=`
      <!-- ===== IMPORTAÇÃO · ARQUIVO ===== -->
      <section data-view="imp-arquivo" hidden>
        <div class="card">
          <h3><span class="import-card-ico"><i data-ico="upload"></i></span>Importar arquivo</h3>
          <div class="import-box-row">
            <label class="file-picker" for="fArquivo"><i data-ico="upload"></i><span class="file-picker-name" id="fArquivoNome">Escolher arquivo</span></label>
            <input type="file" id="fArquivo" class="sr-only">
            <button class="btn btn-primary" id="btImportar" type="button">Importar</button>
          </div>
          <p class="hint">Formato esperado do arquivo</p>
        </div>
      </section>

      <!-- ===== IMPORTAÇÃO · PERÍODOS ===== -->
      <section data-view="imp-periodos" hidden>
        <div class="steps">
          <button class="step-pill" type="button" data-valor="resumido" aria-current="true">Resumido</button>
          <button class="step-pill" type="button" data-valor="detalhado">Detalhado</button>
        </div>
        <p class="empty">Nenhum arquivo importado ainda.</p>
      </section>

      <!-- ===== MOVIMENTO · CONFERÊNCIA ===== -->
      <section data-view="mov-conferencia" hidden>
        <div class="steps">
          <button class="step-pill" type="button" aria-current="true">Geral</button>
          <button class="step-pill" type="button">Detalhe</button>
        </div>
        <div class="stat-grid">
          <div class="stat"><p class="stat-label">Total no período</p><p class="stat-value">0,00</p></div>
          <div class="stat"><p class="stat-label">Itens</p><p class="stat-value">0</p></div>
        </div>
        <div class="painel">
          <div class="painel-head"><p class="painel-titulo">Conferência</p></div>
          <p class="empty">Nada pra conferir ainda.</p>
        </div>
      </section>

      <!-- ===== AUDITORIA · HISTÓRICO ===== -->
      <section data-view="aud-historico" hidden>
        <div class="card"><h3>Histórico</h3><p class="empty">Nenhum registro.</p></div>
      </section>`;
const tplJs=`var nav=nilmaIniciar({
  secoes:[
    {id:'importacao',grupo:1,label:'Importação',icon:'upload',itens:[{v:'imp-arquivo',label:'Arquivo',icon:'fileText'},{v:'imp-periodos',label:'Períodos',icon:'calendar',titulo:'Períodos importados'}]},
    {id:'movimento',grupo:2,label:'Movimento',icon:'repeat',itens:[{v:'mov-conferencia',label:'Conferência',icon:'checkCircle'}]},
    {id:'auditoria',grupo:3,label:'Auditoria',icon:'clock',itens:[{v:'aud-historico',label:'Histórico',icon:'clock'}]}
  ],
  inicial:'imp-arquivo',
  aoAbrir:function(v,info){ /* desenhar a página v */ }
});
document.getElementById('crumbInicio').onclick=function(){nav.go('imp-arquivo');};
document.getElementById('btDrawerInicio').onclick=function(){document.getElementById('drawer').hidden=true;document.getElementById('drawerOverlay').hidden=true;nav.go('imp-arquivo');};
// escolher arquivo: mostra o nome
document.getElementById('fArquivo').addEventListener('change',function(){
  var f=this.files[0];document.getElementById('fArquivoNome').textContent=f?f.name:'Escolher arquivo';
  this.previousElementSibling.classList.toggle('has-file',!!f);
});
document.getElementById('btImportar').onclick=function(){toast('Troque este exemplo pela importação do sistema.');};
// seletor interno: ouvir a troca
document.addEventListener('nilma:seletor',function(e){ /* e.detail.valor */ });`;

/* ---------- tokens.md ---------- */
function blocoVars(txt){const o={};(txt.match(/--[a-z0-9-]+\s*:[^;]+/g)||[]).forEach(d=>{const i=d.indexOf(":");o[d.slice(0,i).trim()]=d.slice(i+1).trim();});return o;}
const rootClaro=blocoVars(css.slice(css.indexOf(":root{"),css.indexOf("}",css.indexOf(":root{"))));
const iEsc=css.indexOf(':root[data-theme="dark"]{');
const rootEscuro=blocoVars(css.slice(iEsc,css.indexOf("}",iEsc)));
const tokensMd=`# Tokens (cores e medidas)

Gerado por \`scripts/montar.js\` a partir de \`css/nilma.css\`. **Não edite à mão**: edite o app de referência e rode o script.

Use sempre \`var(--token)\`, nunca a cor direto. O tema escuro troca só os valores.

| Token | Claro | Escuro |
|---|---|---|
${Object.keys(rootClaro).map(k=>"| `"+k+"` | `"+rootClaro[k]+"` | `"+(rootEscuro[k]||"(igual)")+"` |").join("\n")}
`;

/* ---------- escrever ---------- */
console.log("design-n1 · montando a partir de "+origem+" ("+versao+")");
escrever("css/nilma.css",`/* design-n1 · Nilma UI — CSS do sistema (gerado de ${path.basename(origem)} ${versao}) */\n`+css);
escrever("js/nilma.js",nilmaJs);
escrever("kit/nilma-ui-kit.html",pagina({titulo:"Nilma UI Kit",sistema:"Nilma",tag:"UI Kit",tagTitulo:"Kit de componentes",
  rodape:"design-n1 · base: "+escHtml(path.basename(origem))+" "+escHtml(versao),
  acoes:'<button class="btn" type="button" id="btCopiarCss"><i data-ico="fileText"></i>Copiar CSS</button>',
  conteudo:kitPaginas,cssExtra:kitCss,js:kitJs}));
escrever("templates/esqueleto.html",pagina({titulo:"Novo sistema",sistema:"Novo sistema",tag:"000",tagTitulo:"NOME DA EMPRESA",
  rodape:"design-n1",conteudo:tplConteudo,js:tplJs}));
escrever("docs/tokens.md",tokensMd);
console.log("pronto.");
