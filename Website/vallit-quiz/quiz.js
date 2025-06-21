// -------- config ----------
const TEXT = {
  en: {
    title: "Help pick the next Vallit video",
    intro: "What’s this about? We’re deciding on our next Vallit video. Click through these quick questions—less than two minutes. All answers are anonymous and help us pick the most exciting topic. Thank you! 🙌",
    progressInfo: "~15 questions, < 2 min",
    likertLegend: "How interesting do you find this idea?",
    likertScale: ["1","2","3","4","5"],
    scaleLabels: ["not interesting","meh","okay","interesting","super exciting"],
    concepts: [
      "How exciting would you find a video showing how scammers clone your voice to drain your bank account?",
      "How curious would you be about a video explaining how TikTok and other apps can tell when you’re happy or sad?",
      "Would you watch a video where next-gen AI plans homework with no human input?",
      "How interesting is a video revealing the tricks fast-fashion apps use to make us buy more on impulse?",
      "Does a video about how just 30 cents can buy your entire chat history interest you?",
      "How exciting would a video be where someone types text using only their thoughts?",
      "Would you click a video that shows how new anti-cheat systems ban cheaters before their first shot?"
    ],
    submit: "Submit answers",
    thanks: "Thanks! We'll let you know when the winner is online.",
    extra: {
        freqQ: "How often do you watch tech explainers?",
        freqA: ["Daily","Several times a week","Rarely"],
        lenQ: "What video length do you prefer?",
        lenA: ["Under 8 min","8–15 min","Over 15 min"],
        platQ: "On which platform do you watch such videos most often?",
        platA: ["YouTube","TikTok","Instagram","Other"]
      },
    extra2: {
        techLvlQ: "How interested are you in tech topics overall?",
        techLvlA: ["Not at all","A bit","Quite","Super into it"],
        learningStyleQ: "What helps you understand best?",
        learningStyleA: ["Graphics","Everyday examples","Humorous analogies"],
        paceQ: "At what pace do you prefer explainer videos?",
        paceA: ["Slow & thorough","Medium","Fast & punchy"],
        ctaQ: "What do you usually do after a good explainer?",
        ctaA: ["Share it","Discuss it","Try something","Nothing"]
      }
  },
  de: {
    title: "Blind‑Voting zum nächsten Vallit‑Video",
    intro: "Worum geht’s? Wir planen unser nächstes Vallit-Video. Klick dich kurz durch die Fragen – dauert unter zwei Minuten. Deine Antworten bleiben anonym und helfen uns, das spannendste Thema auszuwählen. Vielen Dank! 🙌",
    progressInfo: "∼ 15 Fragen, < 2 Min",
    likertLegend: "Wie spannend findest du diese Idee?",
    likertScale: ["1","2","3","4","5"],
    scaleLabels: ["uninteressant","eher nicht","okay","spannend","extrem spannend"],
    concepts: [
      "Wie spannend fändest du ein Video, das zeigt, wie Betrüger deine Stimme kopieren und dein Bankkonto plündern?",
      "Wie neugierig wärst du auf ein Video, das erklärt, warum TikTok & Co. genau wissen, wann du gute oder schlechte Laune hast?",
      "Würdest du dir ansehen, wie die nächste KI Hausaufgaben plant, ohne dass jemand ihr etwas eingibt?",
      "Wie interessant findest du ein Video, das zeigt, welche Tricks Fast-Fashion-Apps nutzen, um uns spontan mehr kaufen zu lassen?",
      "Reizt dich ein Video darüber, wie 30 Cent reichen, um deinen gesamten Chat-Verlauf zu kaufen?",
      "Wie spannend wäre ein Video, in dem jemand nur mit Gedanken Text schreibt?",
      "Würdest du ein Video anklicken, das zeigt, wie neue Anti-Cheats Cheater vor dem ersten Schuss bannen?"
    ],
    submit: "Antworten absenden",
    thanks: "🎉 Danke! Wir melden uns, wenn das Sieger-Thema online geht.",
    extra: {
        freqQ: "Wie oft schaust du Tech-Erklärvideos?",
        freqA: ["Täglich","Mehrmals pro Woche","Selten"],
        lenQ: "Welche Videolänge findest du ideal?",
        lenA: ["Unter 8 Min","8–15 Min","Über 15 Min"],
        platQ: "Auf welcher Plattform schaust du solche Videos am häufigsten?",
        platA: ["YouTube","TikTok","Instagram","Andere"]
      },
    extra2: {
        techLvlQ: "Wie sehr interessierst du dich allgemein für Technik-Themen?",
        techLvlA: ["Gar nicht","Ein bisschen","Ziemlich","Extrem"],
        learningStyleQ: "Was hilft dir beim Verstehen am meisten?",
        learningStyleA: ["Grafiken","Beispiele aus dem Alltag","Humorvolle Vergleiche"],
        paceQ: "In welchem Tempo magst du Erklärvideos?",
        paceA: ["Langsam & gründlich","Mittel","Schnell & knackig"],
        ctaQ: "Was machst du nach einem guten Erklärvideo am liebsten?",
        ctaA: ["Teile es","Diskutiere drüber","Teste etwas aus","Nichts"]
      }
  }
};
// ---------------------------

const form    = document.getElementById("quizForm");
const langToggle = document.getElementById("langToggle");
const submit  = document.getElementById("submitBtn");
const thanks  = document.getElementById("thanks");
const progressFill = document.getElementById("progressFill");
let currentLang = "en";

renderForm(currentLang);
langToggle.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if(!btn) return;
  currentLang = btn.dataset.lang;
  [...langToggle.querySelectorAll('button')].forEach(b=>b.classList.toggle('active', b===btn));
  renderForm(currentLang);
});

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
  document.getElementById("pageTitle").hidden = true;
  document.getElementById("intro").hidden = true;
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
  const extra  = t.extra;
  const extra2 = t.extra2;
  const TOTAL_FIELDS = t.concepts.length
                     + (extra ? 3 : 0)
                     + (extra2 ? 4 : 0);
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
      const opt = document.createElement("label");
      opt.className = "ratingOption";
      const num = document.createElement("span");
      num.className = "ratingNum";
      num.textContent = val;
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `c${i}`;
      radio.value = val;
      radio.required = true;
      opt.append(num, radio);
      row.appendChild(opt);
      radio.addEventListener("change", updateProgress);
    });
    card.appendChild(row);

    const legend = document.createElement('div');
    legend.className = 'ratingLabelRow';
    const labels = t.scaleLabels || (lang === "de"
        ? ["lass ich aus","meh","geht","interessant","muss ich sehen"]
        : ["skip","meh","ok","interesting","must see"]);
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
        ? 'Welches Technik-Thema findest du noch viel zu wenig erklärt?'
        : 'Which tech topic do you feel is still rarely explained?';
    wrap.appendChild(p);
    const ta = document.createElement('textarea');
    ta.name = 'ideaSuggestion';
    ta.maxLength = 50;
    ta.placeholder = lang === 'de' ? 'z. B. Datenschutz bei Smart-Homes' : 'e.g. Smart-home privacy';
    wrap.appendChild(ta);
    form.appendChild(wrap);
  }

  if (extra2) {
    addSelect(extra2.techLvlQ, 'techLvl', extra2.techLvlA);
    addSelect(extra2.learningStyleQ, 'learningStyle', extra2.learningStyleA);
    addSelect(extra2.paceQ, 'pace', extra2.paceA);
    addSelect(extra2.ctaQ, 'cta', extra2.ctaA);
  }

  function addSelect(question, name, options){
    const wrapper = document.createElement('div');
    wrapper.className = 'conceptCard';
    const p     = document.createElement('p');
    p.className = 'conceptText';
    p.textContent = question;
    wrapper.appendChild(p);

    const wrapSel = document.createElement('div');
    wrapSel.className = 'selectWrap';
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
    wrapSel.appendChild(sel);
    wrapper.appendChild(wrapSel);
    form.appendChild(wrapper);
  }


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
const darkToggle = document.getElementById("darkToggle");
function syncDark(){
  const on = document.body.classList.contains("dark");
  localStorage.setItem("vallitDark", on ? "1" : "0");
  darkToggle.querySelector('[data-mode="light"]').classList.toggle('active', !on);
  darkToggle.querySelector('[data-mode="dark"]').classList.toggle('active', on);
}
if(localStorage.getItem("vallitDark") === "1")
  document.body.classList.add("dark");
syncDark();
darkToggle.addEventListener("click", e => {
  const btn = e.target.closest('button');
  if(!btn) return;
  const mode = btn.dataset.mode;
  if(mode === 'dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  syncDark();
});

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