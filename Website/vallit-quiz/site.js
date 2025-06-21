const darkToggle = document.getElementById("darkToggle");
function syncDark(){
  const on = document.body.classList.contains("dark");
  localStorage.setItem("vallitDark", on ? "1" : "0");
  const btnLight = darkToggle.querySelector('[data-mode="light"]');
  const btnDark  = darkToggle.querySelector('[data-mode="dark"]');
  btnLight.classList.toggle('active', !on);
  btnDark.classList.toggle('active', on);
  darkToggle.style.setProperty('--seg-x', on ? '100%' : '0%');
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
