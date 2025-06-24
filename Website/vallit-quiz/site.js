const darkToggle = document.getElementById("darkToggle");
const langToggle = document.getElementById("langToggle");

/* -------- translations -------- */
const I18N = {
  en: {
    navVideos: "Videos",
    navTeam: "Team",
    navSettings: "Settings",
    settingsTitle: "Settings",
    quizEntry: "Voting",
    teamAccessEntry: "Team Access",
    heroTitle: "Welcome to Vallit",
    heroDesc:
      "Learn about our YouTube channel and browse the latest videos—each with a short article and all sources.",
    currentVideo: "Current Video",
    videosTitle: "Our Videos",
    videosDesc: "Sources for every video are linked in its article and description.",
    teamTitle: "Our Team",
    teamDesc: "We're preparing an overview of everyone at Vallit. Check back soon!",
    impressumLink: "Legal Notice",
    loginEmployee: "Employee Login",
    loginFriends: "Friends Login",
    loginPrompt: "Please enter password",
    loginButton: "Log in",
    pwPlaceholder: "Password",
    namePlaceholder: "Your name",
    wrongPw: "Wrong password",
    nameRequired: "Please enter your name",
    cancelLogin: "Cancel",
    resultsTitle: "Survey Results (local)",
  },
  de: {
    navVideos: "Videos",
    navTeam: "Team",
    navSettings: "Einstellungen",
    settingsTitle: "Einstellungen",
    quizEntry: "Voting",
    teamAccessEntry: "Team-Zugang",
    heroTitle: "Willkommen bei Vallit",
    heroDesc:
      "Hier findest du Infos zu unserem YouTube-Kanal und unsere neuesten Videos. Zu jedem Video gibt es einen kurzen Artikel mit Quellen.",
    currentVideo: "Aktuelles Video",
    videosTitle: "Unsere Videos",
    videosDesc:
      "Die Quellen zu jedem Video stehen im Artikel und in der Videobeschreibung.",
    teamTitle: "Unser Team",
    teamDesc:
      "Diese Seite befindet sich im Aufbau. Bald stellen wir hier unser Team vor.",
    impressumLink: "Impressum",
    loginEmployee: "Mitarbeiter-Login",
    loginFriends: "Freunde-Login",
    loginPrompt: "Bitte Passwort eingeben",
    loginButton: "Einloggen",
    pwPlaceholder: "Passwort",
    namePlaceholder: "Name",
    wrongPw: "Falsches Passwort",
    nameRequired: "Bitte Name eingeben",
    cancelLogin: "Abbrechen",
    resultsTitle: "Umfrage‑Ergebnisse (lokal)",
  },
};

/* ----- dark mode ----- */
function syncDark() {
  const on = document.body.classList.contains("dark");
  localStorage.setItem("vallitDark", on ? "1" : "0");
  if (!darkToggle) return;
  const btnLight = darkToggle.querySelector('[data-mode="light"]');
  const btnDark  = darkToggle.querySelector('[data-mode="dark"]');
  btnLight.classList.toggle("active", !on);
  btnDark.classList.toggle("active", on);
  darkToggle.style.setProperty("--seg-x", on ? "100%" : "0%");
}
if (localStorage.getItem("vallitDark") === "1")
  document.body.classList.add("dark");
syncDark();
if (darkToggle) darkToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const mode = btn.dataset.mode;
  if (mode === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  syncDark();
});

/* ----- language toggle ----- */
function updateLangUI(lang) {
  if (!langToggle) return;
  const btns = [...langToggle.querySelectorAll("button")];
  btns.forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  const idx = btns.findIndex((b) => b.dataset.lang === lang);
  langToggle.style.setProperty("--seg-x", idx === 1 ? "100%" : "0%");
}

function applyTranslations(lang) {
  const t = I18N[lang];
  if (!t) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.placeholder = t[key];
  });
}

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem("vallitLang", lang);
  updateLangUI(lang);
  applyTranslations(lang);
}
window.setLang = setLang;

const storedLang = localStorage.getItem("vallitLang");
setLang(storedLang || document.documentElement.lang || "en");

if (langToggle) {
  langToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    setLang(btn.dataset.lang);
  });
}

/* ----- settings dropdown ----- */
// sha-256 hash of the password "Team_921"
const QUIZ_HASH = 'b374a2c63426b7182f58d308d1834f65dbf72c1eaedfdfb788eee8bfe10ef1c5';
const TEAM_HASH = '7e018a9c9db6ec835a53577b03fce1e2c032c040818b01de61bc4db1bd260605';
const settingsBtn = document.getElementById('settingsBtn');

if (settingsBtn) {
  const drop = document.createElement('div');
  drop.id = 'settingsMenu';
  drop.className = 'settings-menu';
  drop.hidden = true;
  drop.innerHTML = `
    <button id="menuQuiz" data-i18n="quizEntry">Voting</button>
    <button id="menuTeam" data-i18n="teamAccessEntry">Team</button>
  `;
  document.body.appendChild(drop);

  const modal = document.createElement('div');
  modal.id = 'pwModal';
  modal.className = 'modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal-content">
      <button id="closePw" class="close-btn" aria-label="Close">
        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <h2 id="modalTitle"></h2>
      <input type="text" id="nameInput" data-i18n-placeholder="namePlaceholder" placeholder="Name" />
      <div class="pwWrap">
        <input type="password" id="pwInput" data-i18n-placeholder="pwPlaceholder" placeholder="Passwort" />
        <label class="showPw"><input type="checkbox" id="togglePw"><svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg></label>
      </div>
      <button id="pwSubmit" data-i18n="loginButton">Einloggen</button>
      <p id="nameError" class="error" data-i18n="nameRequired" hidden>Bitte Name eingeben</p>
      <p id="settingsError" class="error" data-i18n="wrongPw" hidden>Falsches Passwort</p>
    </div>`;
  document.body.appendChild(modal);

  applyTranslations(document.documentElement.lang);

  function posDrop() {
    const r = settingsBtn.getBoundingClientRect();
    drop.style.top = r.bottom + 'px';
    drop.style.right = (window.innerWidth - r.right) + 'px';
  }

  function showDrop(){
    posDrop();
    drop.hidden = false;
    requestAnimationFrame(()=>drop.classList.add('show'));
  }
  function hideDrop(){
    drop.classList.remove('show');
    setTimeout(()=>{ drop.hidden = true; },150);
  }
  settingsBtn.addEventListener('click', (e) => {
    if(drop.hidden) showDrop();
    else hideDrop();
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (!drop.contains(e.target) && e.target !== settingsBtn && !drop.hidden) hideDrop();
  });

  const pwInput = modal.querySelector('#pwInput');
  const pwToggle = modal.querySelector('#togglePw');
  const pwSubmit = modal.querySelector('#pwSubmit');
  const pwError = modal.querySelector('#settingsError');
  const nameError = modal.querySelector('#nameError');
  const modalTitle = modal.querySelector('#modalTitle');
  const closePw = modal.querySelector('#closePw');
  const nameInput = modal.querySelector('#nameInput');

  pwToggle.addEventListener('change', () => {
    pwInput.type = pwToggle.checked ? 'text' : 'password';
    const svg = pwToggle.nextElementSibling;
    if(svg){
      svg.classList.add('blink');
      setTimeout(()=>svg.classList.remove('blink'),300);
    }
  });
  pwInput.addEventListener('input', () => { pwError.hidden = true; });
  nameInput.addEventListener('input', () => { nameError.hidden = true; });
  if(closePw) closePw.addEventListener('click', ()=>{
    const box = modal.querySelector('.modal-content');
    box.classList.add('closing');
    box.addEventListener('animationend',()=>{
      modal.hidden = true;
      box.classList.remove('closing');
    },{once:true});
  });

  // submit on Enter
  modal.addEventListener('keydown', e => {
    if(e.key === 'Enter') pwSubmit.click();
  });

  document.getElementById('menuQuiz').addEventListener('click', () => openModal('quiz'));
  document.getElementById('menuTeam').addEventListener('click', () => openModal('team'));

  pwSubmit.addEventListener('click', async () => {
    const target = modal.dataset.target;
    if (target === 'quiz') {
      const name = nameInput.value.trim();
      if (!name) {
        nameError.hidden = false;
        nameInput.focus();
        return;
      }
    }
    const hash = target === 'quiz' ? QUIZ_HASH : TEAM_HASH;
    if (await checkPass(pwInput.value, hash)) {
      sessionStorage.setItem(target === 'quiz' ? 'quizUnlocked' : 'adminOK', '1');
      if(target === 'quiz')
        sessionStorage.setItem('quizUser', nameInput.value.trim());
      modal.hidden = true;
      location.href = target === 'quiz' ? 'quiz.html' : 'admin.html';
      pwError.hidden = true;
    } else {
      pwError.hidden = false;
      pwInput.value = '';
      pwInput.focus();
    }
  });

  function openModal(type) {
    drop.hidden = true;
    modal.dataset.target = type;
    modalTitle.textContent = I18N[document.documentElement.lang][type === 'quiz' ? 'quizEntry' : 'teamAccessEntry'];
    pwInput.value = '';
    pwInput.type = 'password';
    if(pwToggle) pwToggle.checked = false;
    if(nameInput){
      nameInput.value = '';
      nameInput.hidden = type !== 'quiz';
    }
    nameError.hidden = true;
    pwError.hidden = true;
    modal.hidden = false;
    pwInput.focus();
  }
}

async function checkPass(pw, hash) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  return hex === hash;
}
