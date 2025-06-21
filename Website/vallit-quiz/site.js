const darkToggle = document.getElementById("darkToggle");
const langToggle = document.getElementById("langToggle");

/* -------- translations -------- */
const I18N = {
  en: {
    navVideos: "Videos",
    navTeam: "Team",
    navArticles: "Articles",
    navQuiz: "Voting",
    heroTitle: "Welcome to Vallit",
    heroDesc:
      "Here you'll find info about our YouTube channel, our newest videos and exciting tech articles.",
    currentVideo: "Current Video",
    videosTitle: "Our Videos",
    videosDesc: "Sources for this video are in the description on YouTube.",
    articlesTitle: "Articles",
    articlesDesc:
      "Check back soon for interesting posts and resources around our videos.",
    teamTitle: "Our Team",
    teamDesc: "This page will list everyone involved at Vallit.",
    impressumLink: "Imprint",
    loginHeading: "Employee Access",
    loginPrompt: "Please enter password",
    loginButton: "Log in",
    pwPlaceholder: "Password",
    resultsTitle: "Survey Results (local)",
  },
  de: {
    navVideos: "Videos",
    navTeam: "Team",
    navArticles: "Artikel",
    navQuiz: "Voting",
    heroTitle: "Willkommen bei Vallit",
    heroDesc:
      "Hier findest du alle Infos zu unserem YouTube-Kanal, unsere neuesten Videos und spannende Artikel zu Technik-Themen.",
    currentVideo: "Aktuelles Video",
    videosTitle: "Unsere Videos",
    videosDesc:
      "Quellen zum Video findest du in der Videobeschreibung auf YouTube.",
    articlesTitle: "Artikel",
    articlesDesc:
      "In Zukunft findest du hier spannende Beiträge und Quellen rund um unsere Videos.",
    teamTitle: "Unser Team",
    teamDesc:
      "Hier entsteht eine Übersicht über alle Teammitglieder von Vallit.",
    impressumLink: "Impressum",
    loginHeading: "Mitarbeiter-Zugang",
    loginPrompt: "Bitte Passwort eingeben",
    loginButton: "Einloggen",
    pwPlaceholder: "Passwort",
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
