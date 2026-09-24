/* =====================================================================
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
var ICONS = {
  briefcase:'<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/><path d="M2.5 12.5h19"/>',
  fileDown:'<path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7.5Z"/><path d="M14.5 2.5v5h5"/><path d="M12 11v6"/><path d="m9.5 14.5 2.5 2.5 2.5-2.5"/>',
  fileUp:'<path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7.5Z"/><path d="M14.5 2.5v5h5"/><path d="M12 17v-6"/><path d="m9.5 13.5 2.5-2.5 2.5 2.5"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-6h4v6"/>',
  landmark:'<path d="M3 21h18"/><path d="M5 21v-8.5"/><path d="M19 21v-8.5"/><path d="M9.5 21v-8.5"/><path d="M14.5 21v-8.5"/><path d="M2.5 9 12 3l9.5 6Z"/>',
  link:'<path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.8 4.7a4.3 4.3 0 0 1 6.1 6.1L17 12.6"/><path d="M13 17.5l-1.8 1.8a4.3 4.3 0 0 1-6.1-6.1L7 11.4"/>',
  arrowDown:'<path d="M12 4v13"/><path d="m6 12 6 6 6-6"/>',
  arrowUp:'<path d="M12 20V7"/><path d="m6 12 6-6 6 6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8.3 12.3 2.6 2.6 5-5.2"/>',
  scale:'<path d="M12 3v18"/><path d="M7 21h10"/><path d="m4 8 4-4 4 4"/><path d="M2.5 13a3.5 3.5 0 0 0 7 0L6 7Z"/><path d="M14.5 13a3.5 3.5 0 0 0 7 0L18 7Z"/>',
  alert:'<path d="M10.6 3.8a1.6 1.6 0 0 1 2.8 0l8.4 14.6a1.6 1.6 0 0 1-1.4 2.4H3.6a1.6 1.6 0 0 1-1.4-2.4L10.6 3.8Z"/><path d="M12 9.5v4.2"/><path d="M12 17.2h.01"/>',
  lock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5"/><path d="M12 19.5V22"/><path d="M4.9 4.9l1.8 1.8"/><path d="M17.3 17.3l1.8 1.8"/><path d="M2 12h2.5"/><path d="M19.5 12H22"/><path d="M4.9 19.1l1.8-1.8"/><path d="M17.3 6.7l1.8-1.8"/>',
  moon:'<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
  monitor:'<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M8 20.5h8"/><path d="M12 16.5v4"/>',
  upload:'<path d="M12 15V4"/><path d="m7 9 5-5 5 5"/><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
  fileText:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  chevronsLeft:'<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  logOut:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  barChart:'<path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'
};
ICONS.calendar='<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/>';
ICONS.plus='<path d="M12 5v14"/><path d="M5 12h14"/>';
ICONS.fileSearch='<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M14 3v5h5"/><path d="M19 8v2.5"/><circle cx="16" cy="16" r="3"/><path d="m21 21-2.8-2.8"/>';
ICONS.hash='<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>';
ICONS.list='<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3.5 6h.01"/><path d="M3.5 12h.01"/><path d="M3.5 18h.01"/>';
function svg(n,extra){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" '+(extra||'')+'>'+ICONS[n]+'</svg>';}
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
