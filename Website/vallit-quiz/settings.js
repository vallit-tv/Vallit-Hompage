const QUIZ_HASH = '95f628534c5f2ecff6d37f934a54a846fa76952741a4928c843cc54ed0ca996e';
const TEAM_HASH = '7e018a9c9db6ec835a53577b03fce1e2c032c040818b01de61bc4db1bd260605';

const quizBtn = document.getElementById('quizBtn');
const teamBtn = document.getElementById('teamBtn');
const modal = document.getElementById('pwModal');
const modalTitle = document.getElementById('modalTitle');
const pwInput = document.getElementById('pwInput');
const pwSubmit = document.getElementById('pwSubmit');
const pwError = document.getElementById('settingsError');
let target = null;
pwInput.addEventListener('input', () => { pwError.hidden = true; });

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
  modal.hidden = false;
  pwError.hidden = true;
  pwInput.focus();
}

async function checkPass(pw, hash) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  return hex === hash;
}
