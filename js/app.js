const creds={user:"tidewatcher",pass:"MorzePamietaWszystko!1987"};
let lang=localStorage.getItem("ta_lang")||"pl";let dict={pl:{},en:{}};
fetch("data/translations.json").then(r=>r.json()).then(d=>{dict=d;setLang(lang);});
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function setLang(v){lang=v;localStorage.setItem("ta_lang",v);document.documentElement.lang=v;["#lang","#langArchive"].forEach(id=>{const e=$(id);if(e)e.value=v});$$('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(v==='en'&&dict.en[k])e.textContent=dict.en[k];else if(v==='pl'&&e.dataset.pl)e.textContent=e.dataset.pl;else if(v==='pl'&&e.dataset.original)e.textContent=e.dataset.original;});if(v==='pl')location.reloadFlag&&location.reload();}
// Preserve original Polish strings before first translation
window.addEventListener('DOMContentLoaded',()=>{$$('[data-i18n]').forEach(e=>{e.dataset.original=e.textContent;e.dataset.pl=e.textContent});
$('#lang').addEventListener('change',e=>setLang(e.target.value));$('#langArchive').addEventListener('change',e=>setLang(e.target.value));
function page(id){$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('.navlink').forEach(x=>x.classList.toggle('active',x.dataset.page===id));window.scrollTo(0,0)}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));
const stations=$('.stations');['01','02','03','04'].forEach((n,i)=>{stations.insertAdjacentHTML('beforeend',`<article><p class="eyebrow">BOJA-${n}</p><h3>${lang==='en'?'Active':'Aktywna'}</h3><p>${i===3?'1,2 m · 18 km/h · 12,8°C':'1,'+(4+i)+' m · '+(16+i*2)+' km/h'}</p></article>`)});
function show(view){['#publicView','#loginView','#archiveView'].forEach(id=>$(id).classList.add('hidden'));$(view).classList.remove('hidden')}
$('#staffBtn').addEventListener('click',()=>show('#loginView'));$('#backPublic').addEventListener('click',()=>show('#publicView'));$('#showPass').addEventListener('click',()=>{const p=$('#password');p.type=p.type==='password'?'text':'password'});$('#helpBtn').addEventListener('click',()=>$('#helpText').classList.toggle('hidden'));
$('#loginForm').addEventListener('submit',e=>{e.preventDefault();const u=$('#username').value.trim().toLowerCase(),p=$('#password').value,m=$('#loginMessage');if(!u||!p){m.textContent=lang==='en'?'Enter username and password.':'Uzupełnij nazwę użytkownika i hasło.';return}if(u!==creds.user){m.textContent=lang==='en'?'User not found.':'Nie znaleziono użytkownika o podanej nazwie.';return}if(p!==creds.pass){m.textContent=lang==='en'?'Incorrect password. Check the spelling and try again.':'Nieprawidłowe hasło. Sprawdź zapis i spróbuj ponownie.';return}m.style.color='#39745b';m.textContent=lang==='en'?'Authentication complete. Opening archive…':'Uwierzytelnianie zakończone. Otwieranie archiwum…';localStorage.setItem('tidearchive_authenticated','true');setTimeout(()=>show('#archiveView'),450)});
$('#logout').addEventListener('click',()=>{localStorage.removeItem('tidearchive_authenticated');show('#loginView');$('#loginMessage').textContent=lang==='en'?'Session ended.':'Sesja została zakończona.'});
function archivePage(id){$$('.archivepage').forEach(x=>x.classList.toggle('active',x.id===id));$$('.side').forEach(x=>x.classList.toggle('active',x.dataset.archive===id))}
$$('.side').forEach(b=>b.addEventListener('click',()=>archivePage(b.dataset.archive)));$$('.openRecord').forEach(b=>b.addEventListener('click',()=>archivePage('record')));
$$('.tab').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.tabpane').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active');localStorage.setItem('tidearchive_active_tab',b.dataset.tab)}));
const saved=localStorage.getItem('tidearchive_active_tab');if(saved){const b=$(`.tab[data-tab="${saved}"]`);if(b)b.click()}
if(localStorage.getItem('tidearchive_authenticated')==='true')show('#archiveView');
});