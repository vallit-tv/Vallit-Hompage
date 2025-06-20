// -------- config ----------
const TEXT = {
  en: {
    title: "Help pick the next Vallit video",
    intro: "Hey! We're about to film a new Vallit episode and need your quick feedback. This survey takes under 2 minutes – there are no wrong answers. All replies are anonymous and help us choose the most exciting topic.",
    progressInfo: "~8 questions, < 2 min",
    likertLegend: "How interesting do you find this idea?",
    likertScale: ["1","2","3","4","5"],
    concepts: [
      "A cloned AI voice calls your mom and drains the bank account.",
      "An app secretly reads your mood so you keep scrolling forever.",
      "The next AI plans tasks completely without a prompt.",
      "Fast-fashion apps use game tricks so you buy even more.",
      "Your chat logs get sold for pennies and turn you into an ad target.",
      "A brain implant writes homework from pure thoughts.",
      "A hidden PC driver kicks cheaters in 20 milliseconds."
    ],
    tiebreak: "Which topic would you watch right now if you had to pick one?",
    submit: "Submit answers",
    thanks: "Thanks! We'll let you know when the winner is online.",
    extra: {
        freqQ: "How often do you watch tech explainers?",
        freqA: ["daily","several per week","once a week","rarely"],
        lenQ: "What video length do you prefer?",
        lenA: ["under 8 min","8–15 min","15–25 min","doesn't matter"],
        platQ: "Where do you watch tech videos most?",
        platA: ["YouTube","TikTok","Instagram","Other"]
      }
  },
  de: {
    title: "Blind‑Voting zum nächsten Vallit‑Video",
    intro: "Hey! Wir möchten bald ein neues Vallit‑Video veröffentlichen und brauchen dein spontanes Feedback. Die Umfrage dauert unter 2 Minuten – es gibt keine falschen Antworten. Alle Angaben bleiben anonym und helfen uns, das spannendste Thema auszuwählen.",
    progressInfo: "∼ 8 Fragen, < 2 Min",
    likertLegend: "Wie spannend findest du diese Idee?",
    likertScale: ["1","2","3","4","5"],
    concepts: [
      "Eine KI-Stimme ruft bei Mama an und leert das Konto.",
      "Eine App misst heimlich deine Laune, um dich endlos scrollen zu lassen.",
      "Die nächste KI plant Aufgaben ganz ohne Prompt.",
      "Fast-Fashion-Apps setzen Spielmechaniken ein, damit du mehr kaufst.",
      "Dein Handy-Chat wird für Centbeträge verkauft – und du wirst zur Zielgruppe.",
      "Ein Hirn-Implantat schreibt Hausaufgaben allein durch Gedanken.",
      "Ein versteckter PC-Treiber wirft Cheater in 20 ms aus dem Match."
    ],
    tiebreak: "Welches Thema würdest du jetzt sofort anschauen, wenn du dich für eins entscheiden müsstest?",
    submit: "Antworten absenden",
    thanks: "🎉 Danke! Wir melden uns, wenn das Sieger-Thema online geht.",
    extra: {
        freqQ: "Wie oft schaust du Tech-Erklärvideos?",
        freqA: ["täglich","mehrmals pro Woche","einmal pro Woche","selten"],
        lenQ: "Welche Videolänge findest du ideal?",
        lenA: ["unter 8 Min","8–15 Min","15–25 Min","egal"],
        platQ: "Auf welcher Plattform schaust du Tech-Videos am häufigsten?",
        platA: ["YouTube","TikTok","Instagram","Anderes"]
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
  document.getElementById("intro").textContent = t.intro;
  document.getElementById("progressNote").textContent = t.progressInfo;
  form.innerHTML = ""; // wipe

  let answeredCount = 0;
  const extra = t.extra;
  const TOTAL_FIELDS = t.concepts.length + (extra ? 3 : 0) + 1; // ratings + selects + tie‑breaker
  updateProgress();

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
        ? ["lass ich aus","meh","geht","interessant","muss ich sehen"]
        : ["skip","meh","ok","interesting","must see"];
    labels.forEach(txt=>{
      const span=document.createElement('span');
      span.textContent = txt;
      legend.appendChild(span);
    });
    card.appendChild(legend);

    form.appendChild(card);
  });

  /* --- extra questions --- */
  if (extra) {
    addSelect(extra.freqQ, 'freq', extra.freqA);
    addSelect(extra.lenQ , 'len',  extra.lenA);
    addSelect(extra.platQ, 'plat', extra.platA);
    // optional free text
    const wrap = document.createElement('div');
    wrap.className = 'conceptCard';
    const p = document.createElement('p');
    p.className = 'conceptText';
    p.textContent = lang === 'de'
        ? 'Gibt es ein Tech-Thema, das dich schon lange interessiert, aber selten erklärt wird?'
        : 'Is there a tech topic you wish was explained more often?';
    wrap.appendChild(p);
    const ta = document.createElement('textarea');
    ta.name = 'ideaSuggestion';
    ta.maxLength = 50;
    ta.placeholder = lang === 'de' ? 'z. B. Datenschutz bei Smart-Homes' : 'e.g. privacy in smart homes';
    wrap.appendChild(ta);
    form.appendChild(wrap);
  }

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

  submit.textContent = t.submit;
  submit.disabled = true;
  submit.style.opacity = .5;
  thanks.textContent = t.thanks;

  // animate cards as they scroll into view
  setupScrollAnims();

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

// scroll animations for cards
function setupScrollAnims(){
  const cards = document.querySelectorAll('.conceptCard');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, {threshold:0.1});
  cards.forEach(c=>obs.observe(c));
}

// Fisher–Yates shuffle
// function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}