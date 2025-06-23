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
    wrongPw: "Wrong password",
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
    wrongPw: "Falsches Passwort",
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
