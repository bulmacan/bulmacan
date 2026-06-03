// ===============================
//  🧩 RENDER PUZZLE (called after JSON loads)
// ===============================
function renderPuzzle(puzzle) {

  window.correctGroups = puzzle.groups;
  window.hintMessages = puzzle.groups.map(g => ({
    text: g.clue,
    label: g.label
  }));

  const allWords = window.correctGroups.flatMap(group => group.words);
  const shuffledWords = shuffle([...allWords]);

  const grid = document.getElementById("puzzle-grid");
  const feedback = document.getElementById("feedback");
  const timerDisplay = document.getElementById("timer");

  let selected = [];
  let solvedGroups = new Set();
  let startTime = Date.now();
  let countdownDuration = 600; // 10 minutes
  let penaltySeconds = 0;
  let hintIndex = 0;

  grid.innerHTML = "";

  shuffledWords.forEach(word => {
    const div = document.createElement("div");
    div.className = "word";
    div.textContent = word;
    div.setAttribute("aria-label", word);
    div.addEventListener("click", () => handleWordClick(div));
    grid.appendChild(div);
  });

  let timerInterval = setInterval(updateTimer, 1000);

  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = countdownDuration - elapsed - penaltySeconds;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "⏱️ Süre: 00:00";
      window.showResults("timeout", 600);
      return;
    }
    timerDisplay.textContent = `⏱️ Süre: ${formatTime(remaining)}`;
  }

  function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  function handleWordClick(el) {
    if (el.classList.contains("correct")) return;
    const word = el.textContent;
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
    // Total time including hint penalties
    const elapsed = Math.floor((Date.now() - startTime) / 1000) + penaltySeconds;
    window.showResults("success", elapsed);
  }

  const hintContainer = document.getElementById("hint-boxes");
  hintContainer.innerHTML = "";

  puzzle.groups.forEach(() => {
    const box = document.createElement("div");
    box.className = "hint-box";
    box.textContent = "❓İpucu Göster";
    box.addEventListener("click", () => {
      if (box.classList.contains("revealed") || hintIndex >= window.hintMessages.length) return;
      while (hintIndex < window.hintMessages.length && solvedGroups.has(window.hintMessages[hintIndex].label)) {
        hintIndex++;
      }
      if (hintIndex >= window.hintMessages.length) {
        box.textContent = "Tüm ipuçları gösterildi.";
        box.classList.add("revealed");
        return;
      }
      penaltySeconds += 60;
      setTimeout(() => showToast("İpucu size 1 dakika kaybettirdi."), 0);
      box.textContent = window.hintMessages[hintIndex].text;
      void box.offsetWidth;
      box.classList.add("revealed");
      hintIndex++;
    });
    hintContainer.appendChild(box);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("visible"));
  setTimeout(() => t.remove(), 3000);
}
