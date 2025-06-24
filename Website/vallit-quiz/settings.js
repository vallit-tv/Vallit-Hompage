// sha-256 hash of the password "Team_921"
const QUIZ_HASH = 'b374a2c63426b7182f58d308d1834f65dbf72c1eaedfdfb788eee8bfe10ef1c5';
const TEAM_HASH = '7e018a9c9db6ec835a53577b03fce1e2c032c040818b01de61bc4db1bd260605';

const quizBtn = document.getElementById('quizBtn');
const teamBtn = document.getElementById('teamBtn');
const modal = document.getElementById('pwModal');
const modalTitle = document.getElementById('modalTitle');
const pwInput = document.getElementById('pwInput');
const pwSubmit = document.getElementById('pwSubmit');
const pwError = document.getElementById('settingsError');
const pwToggle = document.getElementById('togglePwModal');
const closePw = document.getElementById('closePw');
let target = null;
pwInput.addEventListener('input', () => { pwError.hidden = true; });
if(pwToggle) pwToggle.addEventListener('change',()=>{
  pwInput.type = pwToggle.checked?'text':'password';
  const svg = pwToggle.nextElementSibling;
  if(svg){
    svg.classList.add('blink');
    setTimeout(()=>svg.classList.remove('blink'),300);
  }
});
if(closePw) closePw.addEventListener('click', ()=>{
  const box = modal.querySelector('.modal-content');
  box.classList.add('closing');
  box.addEventListener('animationend',()=>{
    modal.hidden = true;
    box.classList.remove('closing');
  },{once:true});
});

modal.addEventListener('keydown',e=>{
  if(e.key==='Enter') pwSubmit.click();
});

quizBtn.addEventListener('click', () => openModal('quiz'));
teamBtn.addEventListener('click', () => openModal('team'));

pwSubmit.addEventListener('click', async () => {
  const pass = pwInput.value;
  if (!pass) return;
  const hash = target === 'quiz' ? QUIZ_HASH : TEAM_HASH;
  if (await checkPass(pass, hash)) {
    modal.hidden = true;
    if (target === 'quiz') location.href = 'quiz.html';
    else location.href = 'admin.html';
    pwError.hidden = true;
  } else {
    pwError.hidden = false;
    pwInput.value = '';
    pwInput.focus();
  }
});

function openModal(type) {
  target = type;
  modalTitle.textContent = type === 'quiz' ? 'Voting' : 'Team';
  pwInput.value = '';
  pwInput.type = 'password';
  if(pwToggle) pwToggle.checked = false;
  modal.hidden = false;
  pwError.hidden = true;
  pwInput.focus();
}

async function checkPass(pw, hash) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  return hex === hash;
}
