// -------- config ----------
const TEXT = {
  en: {
    title: "Blind Tech-Concept Survey",
    likertLegend: "Rate how eager you’d be to watch:",
    likertScale: ["1","2","3","4","5"],
    concepts: [
      "Would you watch a video about an AI voice clone pulling off a phone-bank heist in under a minute?",
      "Are you curious how a social-media app secretly scores your emotions to keep you scrolling?",
      "Should we explore a next-gen language model that plans tasks on its own—no human prompt?",
      "Would you see how fast-fashion apps use game mechanics so you spend more than planned?",
      "Do you care about your casual phone chat becoming ad gold after data brokers sell it for cents?",
      "How cool would a brain implant be that lets someone type homework purely by thought?",
      "Want to see a hidden PC driver that boots cheaters in 20 milliseconds?"
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
      "Möchtest du sehen, wie eine KI-Stimmenkopie per Telefonbank in Sekunden dein Konto leert?",
      "Interessiert es dich, wie eine Social‑Media‑App heimlich deine Stimmung bewertet?",
      "Sollen wir zeigen, wie ein Sprachmodell Aufgaben ohne menschliche Eingabe plant?",
      "Willst du erfahren, wie Fast‑Fashion‑Apps Spielmechaniken nutzen, damit du mehr kaufst als geplant?",
      "Findest du spannend, dass dein Handy‑Chat für Centbeträge verkauft wird und dich zum Werbeziel macht?",
      "Wie spannend wäre ein Hirnimplantat, das Hausaufgaben allein durch Gedanken schreibt?",
      "Hättest du Lust auf ein Video über einen versteckten PC‑Treiber, der Cheater in 20 ms aus Matches wirft?"
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

  const requiredNames = new Set([...form.elements].filter(el =>
    (el.type === "radio" || el.tagName === "SELECT") && el.required
  ).map(el => el.name));
  TOTAL_FIELDS = requiredNames.size;
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