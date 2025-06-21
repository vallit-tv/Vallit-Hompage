const darkToggle = document.getElementById("darkToggle");
const langToggle = document.getElementById("langToggle");

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

function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem("vallitLang", lang);
  updateLangUI(lang);
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
