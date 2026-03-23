// ===============================
//  🧩 WORD GRID INITIALIZATION
// ===============================
const allWords = window.correctGroups.flatMap(group => group.words);
const shuffledWords = shuffle([...allWords]);

const grid = document.getElementById("puzzle-grid");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");

let selected = [];
let solvedGroups = new Set();
let startTime = Date.now();
let countdownDuration = 600; // 10 minutes
let penaltySeconds = 0;      // Safari-safe penalty tracking
let timerInterval = setInterval(updateTimer, 1000);
let hintIndex = 0;

// Create puzzle grid
shuffledWords.forEach(word => {
  const div = document.createElement("div");
  div.className = "word";
  div.textContent = word;
  div.setAttribute("aria-label", word);
  div.addEventListener("click", () => handleWordClick(div));
  grid.appendChild(div);
});

// ===============================
// ⏱️ TIMER LOGIC (Safari-safe)
// ===============================
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = countdownDuration - elapsed - penaltySeconds;

  if (remaining <= 0) {
    clearInterval(timerInterval);
    timerDisplay.textContent = "⏱️ Süre: 00:00";
    window.showResults("timeout");
    return;
  }

  timerDisplay.textContent = `⏱️ Süre: ${formatTime(remaining)}`;
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

// ===============================
//  🧠 WORD SELECTION + GROUP CHECK
// ===============================
function handleWordClick(el) {
  if (el.classList.contains("correct")) return;

  const word = el.textContent;

  // Safari-safe toggle
  if (el.classList.contains("selected")) {
    el.classList.remove("selected");
    selected = selected.filter(w => w !== word);
  } else {
    el.classList.add("selected");
    selected.push(word);
  }

  if (selected.length === 4) checkGroup(selected);
}

function checkGroup(group) {
  const match = window.correctGroups.find(({ words, label }) =>
    words.every(word => group.includes(word)) && !solvedGroups.has(label)
  );

  if (match) {
    solvedGroups.add(match.label);
    feedback.textContent = `✅ Doğru grup: ${match.label}`;

    updateWordStyles(group, ["selected"], ["correct", match.class]);

    if (solvedGroups.size === window.correctGroups.length) endGame();
  } else {
    feedback.textContent = "❌ Yanlış grup, tekrar deneyin.";
    updateWordStyles(group, ["selected"], ["incorrect"]);
    setTimeout(() => updateWordStyles(group, ["incorrect"], []), 1500);
  }

  selected = [];
}

function updateWordStyles(words, removeClasses, addClasses) {
  document.querySelectorAll(".word").forEach(el => {
    if (words.includes(el.textContent)) {
      removeClasses.forEach(cls => el.classList.remove(cls));
      addClasses.forEach(cls => el.classList.add(cls));
    }
  });
}

function endGame() {
  clearInterval(timerInterval);
  window.showResults("success");
}

// ===============================
//  🔀 SHUFFLE
// ===============================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ===============================
//  💡 HINT SYSTEM (Safari‑safe)
// ===============================
document.querySelectorAll(".hint-box").forEach((box) => {
  box.addEventListener("click", () => {
    if (box.classList.contains("revealed") || hintIndex >= window.hintMessages.length) return;

    // Skip hints for solved groups
    while (
      hintIndex < window.hintMessages.length &&
      solvedGroups.has(window.hintMessages[hintIndex].label)
    ) {
      hintIndex++;
    }

    // No hints left
    if (hintIndex >= window.hintMessages.length) {
      box.textContent = "Tüm ipuçları gösterildi.";
      box.classList.add("revealed");
      return;
    }

    // Apply penalty (Safari-safe)
    penaltySeconds += 60;

    // Toast must run in microtask for Safari
    setTimeout(() => showToast("İpucu size 1 dakika kaybettirdi."), 0);

    // Reveal hint
    box.textContent = window.hintMessages[hintIndex].text;

    // Safari reflow fix before adding class
    void box.offsetWidth;

    box.classList.add("revealed");
    hintIndex++;
  });
});

// ===============================
//  🔔 TOAST SYSTEM (Safari-safe)
// ===============================
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);

  // Safari sometimes delays transitions → microtask ensures reliability
  requestAnimationFrame(() => t.classList.add("visible"));

  setTimeout(() => t.remove(), 3000);
}

function renderKumelemeceResult(result) {
  clearInterval(timerInterval);

  // Hide game UI
  document.getElementById("puzzle-grid").style.display = "none";
  document.getElementById("hint-boxes").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("feedback").style.display = "none";

  // Show result screen
  const container = document.getElementById("result-screen");
  container.style.display = "block";
  container.innerHTML = "";

  if (result === "success") {
    const successHTML = `
      <div class="success-message">
        <span>HARİKA 🎉</span> Tüm grupları buldunuz!
      </div>
    `;

    const groupHTML = window.correctGroups
      .map((group, index) => {
        const words = group.words
          .map(w => `<span class="highlight-${index + 1}">${w}</span>`)
          .join(", ");
        return `<p><strong>${words}</strong> → <em>${group.label}</em></p>`;
      })
      .join("");

    const shareHTML = `
      <a class="share-button" href="https://www.facebook.com/sharer/sharer.php?u=https://bulmacan.com" target="_blank">
        📣 Bulmacaları beğendiniz mi?<br>
        Facebook’da bizi önermek için tıklayın<br>
        daha çok oyuncu, daha çok bulmaca! 😊
      </a>
    `;

    container.innerHTML = successHTML + `<div class="group-info">${groupHTML}</div>` + shareHTML;
  }

  else if (result === "timeout") {
    container.innerHTML = `
      <div class="success-message" style="color:#c62828;">
        <span>Üzgünüz ⏱️</span> Süre doldu, tekrar deneyin!
      </div>
    `;
  }
}