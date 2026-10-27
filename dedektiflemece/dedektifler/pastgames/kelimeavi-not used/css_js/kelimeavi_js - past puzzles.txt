function initializePuzzle(matrix, words, onWordFound) {
  const gridSize = matrix[0].length;
  const grid = document.getElementById("grid");
  const feedback = document.getElementById("feedback");
  const progress = document.getElementById("progress");

  let selectedCells = [];
  const foundWords = new Set();
  const usedCells = new Set();

  // Clear grid before rendering
  grid.innerHTML = "";

  // Render grid from matrix
  matrix.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.key = `${r},${c}`;
      grid.appendChild(cell);

      cell.addEventListener("click", () => {
        const key = cell.dataset.key;
        if (usedCells.has(key)) {
          feedback.textContent = "❌ Bu harf kullanıldı!";
          return;
        }

        if (selectedCells.includes(key)) {
          cell.classList.remove("selected");
          selectedCells = selectedCells.filter(k => k !== key);
          feedback.textContent = "";
        } else {
          cell.classList.add("selected");
          selectedCells.push(key);

          const selectedLetters = selectedCells.map(k => {
            const [r, c] = k.split(",").map(Number);
            return matrix[r][c];
          }).join("");

          const possibleMatch = words.find(w => w === selectedLetters);

          if (possibleMatch) {
            if (isAdjacentPath(selectedCells)) {
              markWordFound(possibleMatch);
            } else {
              feedback.textContent = "❌ Harfler birbirine değmeli!";
              clearSelection();
            }
          } else if (selectedLetters.length >= Math.max(...words.map(w => w.length))) {
            feedback.textContent = "❌ Bu kelime bulunamadı!";
            clearSelection();
          }
        }
      });
    });
  });

  function isAdjacentPath(cells) {
    for (let i = 1; i < cells.length; i++) {
      const [r1, c1] = cells[i - 1].split(",").map(Number);
      const [r2, c2] = cells[i].split(",").map(Number);
      const rowDiff = Math.abs(r1 - r2);
      const colDiff = Math.abs(c1 - c2);
      if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
        return false;
      }
    }
    return true;
  }

  function markWordFound(word) {
    selectedCells.forEach(key => {
      usedCells.add(key);
      const [r, c] = key.split(",").map(Number);
      const index = r * gridSize + c;
      const cell = grid.children[index];
      cell.classList.remove("selected");
      cell.classList.add("found");
    });

    drawLineThrough(selectedCells);

    foundWords.add(word);
    progress.textContent = `${foundWords.size} / ${words.length} bulundu`;
    selectedCells = [];

    if (typeof onWordFound === "function") {
      onWordFound();
    }
  }

  function clearSelection() {
    selectedCells.forEach(key => {
      const [r, c] = key.split(",").map(Number);
      const index = r * gridSize + c;
      const cell = grid.children[index];
      cell.classList.remove("selected");
    });
    selectedCells = [];
  }

  function drawLineThrough(cells) {
    const svg = document.getElementById("overlay");
    const containerRect = document.getElementById("game-container").getBoundingClientRect();

    const getCellCenter = (key) => {
      const [r, c] = key.split(",").map(Number);
      const cell = grid.children[r * gridSize + c];
      const rect = cell.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    };

    const start = getCellCenter(cells[0]);
    const end = getCellCenter(cells[cells.length - 1]);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", "#ff5722");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
  }
}