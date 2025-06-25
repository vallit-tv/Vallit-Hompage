

/* admin.js – local results viewer with password gate */
const KEY   = "vallitResponses";
const PASS_HASH = "7e018a9c9db6ec835a53577b03fce1e2c032c040818b01de61bc4db1bd260605"; // sha-256 of password

/* elements */
const gate   = document.getElementById("loginBox");
const mainEl = document.querySelector("main");
const pwIn   = document.getElementById("pw");
const goBtn  = document.getElementById("go");
const tbody  = document.querySelector("#resultsTable tbody");
const modal  = document.getElementById("detailModal");
const detailBox = document.getElementById("detailBox");
const closeBtn = document.getElementById("closeModal");
const errorMsg = document.getElementById("adminError");
const showPw = document.getElementById('showAdminPw');
const countEl = document.getElementById('resultCount');
const closeLogin = document.getElementById('closeLogin');
pwIn.addEventListener('input', () => { errorMsg.hidden = true; });
if(showPw) showPw.addEventListener('change',()=>{
  pwIn.type = showPw.checked?'text':'password';
  const svg = showPw.nextElementSibling;
  if(svg){
    svg.classList.add('blink');
    setTimeout(()=>svg.classList.remove('blink'),300);
  }
});
if(closeLogin) closeLogin.addEventListener('click',()=>{
  gate.classList.add('closing');
  gate.addEventListener('animationend', () => {
    location.href = 'index.html';
  }, { once: true });
});

if(sessionStorage.getItem('adminOK')==='1'){
  gate.remove();
  mainEl.hidden = false;
  render();
}

goBtn.addEventListener("click", async () => {
  if (await checkPass(pwIn.value, PASS_HASH)) {
    gate.remove();
    mainEl.hidden = false;
    modal.hidden = true;
    detailBox.textContent = "";
    errorMsg.hidden = true;
    sessionStorage.setItem('adminOK','1');
    render();
  } else {
    errorMsg.hidden = false;
    pwIn.value = "";
    pwIn.focus();
  }
});

gate.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    goBtn.click();
  }
});

async function checkPass(pw, hash) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  return hex === hash;
}

/* ---------- render table ---------- */
function render() {
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  tbody.innerHTML = "";
  if(countEl) countEl.textContent = stored.length ? `Total: ${stored.length}` : '';

  if (stored.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align:center;color:#777;">Keine Antworten gespeichert.</td></tr>';
    return;
  }

  stored.forEach((row, idx) => {
    const tr = document.createElement("tr");
    const date = new Date(row.timestamp).toLocaleString();
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${row.name || ''}</td>
      <td>${date}</td>
      <td><button class="viewBtn" data-idx="${idx}">View</button></td>
    `;
    tbody.appendChild(tr);
  });
}

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".viewBtn");
  if (!btn) return;
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  const data = stored[btn.dataset.idx];
  if (!data) return;
  detailBox.textContent = JSON.stringify(data, null, 2);
  modal.hidden = false;
});

closeBtn.addEventListener("click", () => {
  modal.hidden = true;
});

/* live‑update if another tab stores new responses */
window.addEventListener("storage", e => {
  if (e.key === KEY && !mainEl.hidden) render();
});