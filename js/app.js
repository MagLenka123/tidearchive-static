const creds = {
  user: "tidewatcher",
  passwords: [
    "MorzePamietaWszystko!1987",
    "TheSeaRemembersEverything!1987"
  ]
};

let lang = localStorage.getItem("ta_lang") || "pl";
let dict = { pl: {}, en: {} };
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
let originals = {};

function captureOriginals() {
  $$('[data-i18n]').forEach((e, i) => {
    const id = e.dataset.i18n + "::" + i;
    originals[id] = e.textContent;
    e.dataset.i18nId = id;
  });
}

function localizeStatic() {
  $$('[data-i18n]').forEach(e => {
    const key = e.dataset.i18n;
    if (lang === "en" && dict.en[key]) {
      e.textContent = dict.en[key];
    } else if (lang === "pl" && originals[e.dataset.i18nId] !== undefined) {
      e.textContent = originals[e.dataset.i18nId];
    }
  });

  ["#lang", "#langArchive"].forEach(id => {
    const e = $(id);
    if (e) e.value = lang;
  });

  document.documentElement.lang = lang;
  document.title = lang === "en"
    ? "TideArchive | Coastal Research Institute"
    : "TideArchive | Instytut Badań Przybrzeżnych";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = lang === "en"
      ? "Coastal Research Institute of Mist Island"
      : "Instytut Badań Przybrzeżnych Wyspy Mgieł";
  }

  const chart = $('.chart');
  if (chart) chart.setAttribute('aria-label', lang === "en" ? "Vibration chart" : "Wykres drgań");
}

function renderStations() {
  const stations = $('.stations');
  if (!stations) return;
  const prefix = lang === "en" ? "BUOY" : "BOJA";
  const values = [
    "1.4 m · 16 km/h",
    "1.5 m · 18 km/h",
    "1.6 m · 20 km/h",
    "1.2 m · 18 km/h · 12.8°C"
  ];
  stations.innerHTML = ["01", "02", "03", "04"].map((n, i) => `
    <article>
      <p class="eyebrow">${prefix}-${n}</p>
      <h3>${lang === "en" ? "Active" : "Aktywna"}</h3>
      <p>${values[i]}</p>
    </article>
  `).join("");
}

function localizeRecordIdentifiers() {
  const prefix = lang === "en" ? "BUOY" : "BOJA";
  document.querySelectorAll('b,h1,option,.eyebrow').forEach(e => {
    if (/BOJA-04|BUOY-04/.test(e.textContent)) {
      e.textContent = e.textContent.replace(/BOJA-04|BUOY-04/g, prefix + "-04");
    }
  });

  const recordId = document.querySelector('#record .recordhead .eyebrow');
  if (recordId) recordId.textContent = `IBP-WM/${prefix}-04/2019-0513`;

  const codes = $$('#history code');
  if (codes[0]) {
    codes[0].textContent = (lang === "en" ? "event time" : "czas zdarzenia") + " = 23:12";
  }
}

function setLang(v) {
  lang = v === "en" ? "en" : "pl";
  localStorage.setItem("ta_lang", lang);
  localizeStatic();
  renderStations();
  localizeRecordIdentifiers();
}

function page(id) {
  $$('.page').forEach(x => x.classList.toggle('active', x.id === id));
  $$('.navlink').forEach(x => x.classList.toggle('active', x.dataset.page === id));
  window.scrollTo(0, 0);
}

function show(view) {
  ['#publicView', '#loginView', '#archiveView'].forEach(id => {
    const element = $(id);
    if (element) element.classList.add('hidden');
  });
  const target = $(view);
  if (target) target.classList.remove('hidden');
}

function archivePage(id) {
  $$('.archivepage').forEach(x => x.classList.toggle('active', x.id === id));
  $$('.side').forEach(x => x.classList.toggle('active', x.dataset.archive === id));
}

window.addEventListener('DOMContentLoaded', async () => {
  captureOriginals();

  try {
    const response = await fetch("data/translations.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dict = await response.json();
  } catch (error) {
    console.error('Translation file unavailable', error);
  }

  $('#lang')?.addEventListener('change', e => setLang(e.target.value));
  $('#langArchive')?.addEventListener('change', e => setLang(e.target.value));

  $$('[data-page]').forEach(b => b.addEventListener('click', () => page(b.dataset.page)));
  $('#staffBtn')?.addEventListener('click', () => show('#loginView'));
  $('#backPublic')?.addEventListener('click', () => show('#publicView'));

  $('#showPass')?.addEventListener('click', () => {
    const p = $('#password');
    p.type = p.type === 'password' ? 'text' : 'password';
    $('#showPass').textContent = p.type === 'password'
      ? (lang === 'en' ? 'Show' : 'Pokaż')
      : (lang === 'en' ? 'Hide' : 'Ukryj');
  });

  $('#helpBtn')?.addEventListener('click', () => $('#helpText')?.classList.toggle('hidden'));

  $('#loginForm')?.addEventListener('submit', e => {
    e.preventDefault();

    const u = $('#username').value.trim().toLowerCase();
    const p = $('#password').value;
    const m = $('#loginMessage');
    m.style.color = '#b33a3a';

    if (!u || !p) {
      m.textContent = lang === 'en'
        ? (dict.en.loginEmpty || 'Enter your username and password.')
        : (dict.pl.loginEmpty || 'Uzupełnij nazwę użytkownika i hasło.');
      return;
    }

    if (u !== creds.user) {
      m.textContent = lang === 'en'
        ? (dict.en.userMissing || 'No user was found with that username.')
        : (dict.pl.userMissing || 'Nie znaleziono użytkownika o podanej nazwie.');
      return;
    }

    if (!creds.passwords.includes(p)) {
      m.textContent = lang === 'en'
        ? (dict.en.badPassword || 'Incorrect password. Check the spelling and try again.')
        : (dict.pl.badPassword || 'Nieprawidłowe hasło. Sprawdź zapis i spróbuj ponownie.');
      return;
    }

    m.style.color = '#39745b';
    m.textContent = lang === 'en'
      ? (dict.en.authOk || 'Authentication successful. Opening the archive…')
      : (dict.pl.authOk || 'Uwierzytelnianie zakończone. Otwieranie archiwum…');

    localStorage.setItem('tidearchive_authenticated', 'true');
    setTimeout(() => show('#archiveView'), 450);
  });

  $('#logout')?.addEventListener('click', () => {
    localStorage.removeItem('tidearchive_authenticated');
    show('#loginView');
    const message = $('#loginMessage');
    if (message) {
      message.textContent = lang === 'en'
        ? (dict.en.sessionEnded || 'Session ended.')
        : (dict.pl.sessionEnded || 'Sesja została zakończona.');
    }
  });

  $$('.side').forEach(b => b.addEventListener('click', () => archivePage(b.dataset.archive)));
  $$('.openRecord').forEach(b => b.addEventListener('click', () => archivePage('record')));

  $$('.tab').forEach(b => b.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    $$('.tabpane').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $('#' + b.dataset.tab)?.classList.add('active');
    localStorage.setItem('tidearchive_active_tab', b.dataset.tab);
  }));

  const saved = localStorage.getItem('tidearchive_active_tab');
  if (saved) {
    const b = document.querySelector(`.tab[data-tab="${saved}"]`);
    if (b) b.click();
  }

  setLang(lang);

  if (localStorage.getItem('tidearchive_authenticated') === 'true') {
    show('#archiveView');
  }
});
