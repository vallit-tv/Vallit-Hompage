// -------- config ----------
const TEXT = {
  en: {
    title: "Blind Tech-Concept Survey",
    likertLegend: "Rate how eager you’d be to watch:",
    likertScale: ["1","2","3","4","5"],
    concepts: [
      "An AI voice clone pulls off a phone-bank heist in under a minute.",
      "A social-media app secretly scores your emotions to keep you scrolling.",
      "The next-gen language model plans tasks on its own—no human prompt.",
      "Fast-fashion apps use game mechanics so you spend more than you planned.",
      "Your casual phone chat becomes ad gold after data brokers sell it for cents.",
      "A brain implant lets someone type homework purely by thought.",
      "A hidden PC driver boots cheaters in 20 milliseconds."
    ],
    tiebreak: "If you could watch only one right now, choose it:",
    submit: "Submit",
    thanks: "Thanks for helping Vallit decide! 👋"
  },
  de: {
    title: "Blind‑Voting zum nächsten Vallit‑Video",
    likertLegend: "Wie sehr reizt dich das Thema?",
    likertScale: ["1","2","3","4","5"],
    concepts: [
      "Eine KI-Stimmenkopie räumt per Telefonbank in Sekunden dein Konto leer.",
      "Eine Social‑Media‑App bewertet heimlich deine Stimmung, um dich festzuhalten.",
      "Ein Sprachmodell plant Aufgaben ganz ohne menschliche Eingabe.",
      "Fast‑Fashion‑Apps nutzen Spielmechaniken, damit du mehr kaufst als geplant.",
      "Dein Handy‑Chat wird für Centbeträge verkauft und macht dich zum Werbeziel.",
      "Ein Hirnimplantat schreibt Hausaufgaben allein durch Gedanken.",
      "Ein versteckter PC‑Treiber wirft Cheater in 20 ms aus Matches."
    ],
    tiebreak: "Wenn du nur eines wählen dürftest – welches?",
    submit: "Abschicken",
    thanks: "Danke fürs Mitmachen! 👋"
    , extra: {
        freqQ: "Wie oft schaust du Erklärvideos?",
        freqA: ["Täglich","Mehrmals/Woche","Selten"],
        lenQ: "Welche Videolänge findest du ideal?",
        lenA: ["< 8 Min","8–15 Min","> 15 Min"],
        platQ: "Wo schaust du Tech‑Videos am liebsten?",
        platA: ["YouTube","TikTok","Instagram"]
      }
  }
};
// ---------------------------

const form    = document.getElementById("quizForm");
const langSel = document.getElementById("langSelect");
const submit  = document.getElementById("submitBtn");
const thanks  = document.getElementById("thanks");
const progressFill = document.getElementById("progressFill");
let currentLang = "en";

renderForm(currentLang);
langSel.onchange = e => { currentLang = e.target.value; renderForm(currentLang); };

submit.onclick = e => {
  e.preventDefault();

  // collect answers → plain object
  const formData = Object.fromEntries(new FormData(form).entries());

  // save locally so admin.html can read it
  const KEY = "vallitResponses";
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  stored.push({ timestamp: Date.now(), ...formData });
  localStorage.setItem(KEY, JSON.stringify(stored));

  thanks.textContent = TEXT[currentLang].thanks;

  // UI feedback
  form.hidden = true;
  submit.hidden = true;
  thanks.hidden = false;
  console.log("Saved Vallit response:", formData);
};

// ---- helpers ----
function renderForm(lang) {
  const t = TEXT[lang];
  document.getElementById("pageTitle").textContent = t.title;
  form.innerHTML = ""; // wipe

  let answeredCount = 0;
  let TOTAL_FIELDS = 0;

  /* --- concept cards --- */
  const order = [...t.concepts.keys()];
  order.forEach(i => {
    const card = document.createElement("div");
    card.className = "conceptCard";

    const p = document.createElement("p");
    p.className = "conceptText";
    p.textContent = t.concepts[i];
    card.appendChild(p);

    const q = document.createElement("div");
    q.className = "likertLegend";
    q.textContent = t.likertLegend;
    card.appendChild(q);

    const row = document.createElement("div");
    row.className = "ratingRow";
    t.likertScale.forEach(val => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `c${i}`;
      radio.value = val;
      radio.required = true;
      row.appendChild(radio);
      radio.addEventListener("change", updateProgress);
    });
    card.appendChild(row);

    const legend = document.createElement('div');
    legend.className = 'ratingLabelRow';
    const labels = lang === "de"
        ? ["skip","meh","okay","gut","muss"]
        : ["skip","meh","ok","good","must"];
    labels.forEach(txt=>{
      const span=document.createElement('span');
      span.textContent = txt;
      legend.appendChild(span);
    });
    card.appendChild(legend);

    form.appendChild(card);
  });

  /* --- extra questions --- */
  const extra = t.extra;
  addSelect(extra.freqQ, 'freq', extra.freqA);
  addSelect(extra.lenQ , 'len',  extra.lenA);
  addSelect(extra.platQ, 'plat', extra.platA);

  function addSelect(question, name, options){
    const wrapper = document.createElement('div');
    wrapper.className = 'conceptCard';
    const p     = document.createElement('p');
    p.className = 'conceptText';
    p.textContent = question;
    wrapper.appendChild(p);

    const sel = document.createElement('select');
    const def = document.createElement('option');
    def.value = "";
    def.textContent = lang === "de" ? "– auswählen –" : "– choose –";
    def.disabled = def.selected = true;
    sel.appendChild(def);

    sel.name = name;
    sel.required = true;
    options.forEach(opt=>{
      const o=document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    });
    sel.addEventListener("change", updateProgress);
    wrapper.appendChild(sel);
    form.appendChild(wrapper);
  }

  // Tie-breaker
  const tie = document.createElement("fieldset");
  const leg = document.createElement("legend"); leg.textContent = t.tiebreak; tie.appendChild(leg);
  order.forEach(i=>{
    const r = document.createElement("div"); r.className="row";
    const radio = document.createElement("input");
    radio.type="radio"; radio.name="favorite"; radio.value=`c${i}`; radio.required=true;
    radio.addEventListener("change", updateProgress);
    const label = document.createElement("span"); label.textContent = t.concepts[i].slice(0,60)+"…";
    r.append(radio,label); tie.appendChild(r);
  });
  form.appendChild(tie);

  // count unique fields for progress
  TOTAL_FIELDS = new Set([...form.elements].map(el => el.name)).size;
  updateProgress();

  submit.textContent = t.submit;
  submit.disabled = true;
  submit.style.opacity = .5;
  thanks.textContent = t.thanks;

  function updateProgress(){
    answeredCount = [...form.elements].filter(el=>{
      if(el.type==="radio") return el.checked;
      if(el.tagName==="SELECT") return el.value;
      return false;
    }).length;
    const pct = Math.min(100, Math.round((answeredCount / TOTAL_FIELDS) * 100));
    if (progressFill) {
      progressFill.style.width = pct + "%";
      const pctTxt = document.getElementById("progressPct");
      if (pctTxt) pctTxt.textContent = pct + " %";
    }
    submit.disabled = answeredCount < TOTAL_FIELDS;
    submit.style.opacity = submit.disabled ? .5 : 1;
  }
}

// ---- night‑mode toggle ----
const darkSwitch = document.getElementById("darkSwitch");
function initDark(){
  if(darkSwitch.checked){
    document.body.classList.add("dark");
    localStorage.setItem("vallitDark","1");
  }else{
    document.body.classList.remove("dark");
    localStorage.setItem("vallitDark","0");
  }
}
darkSwitch.checked = localStorage.getItem("vallitDark")==="1";
initDark();
darkSwitch.addEventListener("change", initDark);

// Fisher–Yates shuffle
// function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}