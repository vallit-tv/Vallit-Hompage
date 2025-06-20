

/* admin.js – local results viewer with password gate */
const KEY   = "vallitResponses";
const PASS  = "070507";

/* elements */
const gate   = document.getElementById("loginBox");
const mainEl = document.querySelector("main");
const pwIn   = document.getElementById("pw");
const goBtn  = document.getElementById("go");
const tbody  = document.querySelector("#resultsTable tbody");

goBtn.addEventListener("click", () => {
  if (pwIn.value === PASS) {
    gate.remove();
    mainEl.hidden = false;
    render();
  } else {
    alert("Falsches Passwort");
    pwIn.value = "";
    pwIn.focus();
  }
});

/* ---------- render table ---------- */
function render() {
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  tbody.innerHTML = "";

  if (stored.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:#777;">Keine Antworten gespeichert.</td></tr>';
    return;
  }

  stored.forEach((row, idx) => {
    const tr = document.createElement("tr");
    const date = new Date(row.timestamp).toLocaleString();

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${date}</td>
      <td>${[
        row.c0 ?? "-", row.c1 ?? "-", row.c2 ?? "-",
        row.c3 ?? "-", row.c4 ?? "-", row.c5 ?? "-", row.c6 ?? "-"
      ].join(" / ")}</td>
      <td>${row.favorite ?? "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* live‑update if another tab stores new responses */
window.addEventListener("storage", e => {
  if (e.key === KEY && !mainEl.hidden) render();
});