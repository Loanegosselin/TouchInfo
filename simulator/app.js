"use strict";

const gridElement = document.querySelector("#grid");
const columnsInput = document.querySelector("#columns");
const rowsInput = document.querySelector("#rows");
const resizeButton = document.querySelector("#resize");
const drawButton = document.querySelector("#drawMode");
const eraseButton = document.querySelector("#eraseMode");
const brushInput = document.querySelector("#brushSize");
const brushOutput = document.querySelector("#brushOutput");
const clearButton = document.querySelector("#clear");
const invertButton = document.querySelector("#invert");
const downloadButton = document.querySelector("#download");
const uploadInput = document.querySelector("#upload");
const speakButton = document.querySelector("#speak");
const stopSpeechButton = document.querySelector("#stopSpeech");
const speechText = document.querySelector("#speechText");
const statusElement = document.querySelector("#status");
const activePresetElement = document.querySelector("#activePreset");

let columns = 40;
let rows = 24;
let matrix = [];
let mode = "draw";
let pointerDown = false;
let cursor = { x: 0, y: 0 };

function announce(message) {
  statusElement.textContent = message;
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => {
    statusElement.textContent = "Ready";
  }, 2200);
}

function emptyMatrix(width, height) {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

function createGrid(width = columns, height = rows) {
  columns = Math.max(8, Math.min(80, Number(width) || 40));
  rows = Math.max(8, Math.min(60, Number(height) || 24));
  columnsInput.value = columns;
  rowsInput.value = rows;
  matrix = emptyMatrix(columns, rows);
  cursor = { x: 0, y: 0 };
  gridElement.style.setProperty("--cols", columns);
  gridElement.style.setProperty("--rows", rows);
  gridElement.replaceChildren();

  const fragment = document.createDocumentFragment();
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.dataset.x = x;
      dot.dataset.y = y;
      dot.setAttribute("role", "gridcell");
      dot.setAttribute("aria-label", `Column ${x + 1}, row ${y + 1}, lowered`);
      fragment.append(dot);
    }
  }
  gridElement.append(fragment);
  render();
}

function dotAt(x, y) {
  if (x < 0 || y < 0 || x >= columns || y >= rows) return null;
  return gridElement.children[y * columns + x];
}

function paint(centerX, centerY, value = mode === "draw" ? 1 : 0) {
  const size = Number(brushInput.value);
  const radius = size - 1;
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (x >= 0 && y >= 0 && x < columns && y < rows) matrix[y][x] = value;
    }
  }
  renderRegion(centerX, centerY, radius);
}

function renderRegion(centerX, centerY, radius) {
  for (let y = Math.max(0, centerY - radius); y <= Math.min(rows - 1, centerY + radius); y += 1) {
    for (let x = Math.max(0, centerX - radius); x <= Math.min(columns - 1, centerX + radius); x += 1) {
      updateDot(x, y);
    }
  }
}

function updateDot(x, y) {
  const dot = dotAt(x, y);
  if (!dot) return;
  const raised = Boolean(matrix[y][x]);
  dot.classList.toggle("on", raised);
  dot.classList.toggle("cursor", x === cursor.x && y === cursor.y);
  dot.setAttribute("aria-label", `Column ${x + 1}, row ${y + 1}, ${raised ? "raised" : "lowered"}`);
}

function render() {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) updateDot(x, y);
  }
}

function setMode(nextMode) {
  mode = nextMode;
  const drawing = mode === "draw";
  drawButton.classList.toggle("active", drawing);
  eraseButton.classList.toggle("active", !drawing);
  drawButton.classList.toggle("secondary", !drawing);
  eraseButton.classList.toggle("secondary", drawing);
  drawButton.setAttribute("aria-pressed", drawing);
  eraseButton.setAttribute("aria-pressed", !drawing);
  announce(drawing ? "Raise dots mode" : "Lower dots mode");
}

function line(x0, y0, x1, y1) {
  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    if (x0 >= 0 && y0 >= 0 && x0 < columns && y0 < rows) matrix[y0][x0] = 1;
    if (x0 === x1 && y0 === y1) break;
    const error2 = 2 * error;
    if (error2 >= dy) { error += dy; x0 += sx; }
    if (error2 <= dx) { error += dx; y0 += sy; }
  }
}

function rect(x, y, width, height, filled = false) {
  if (filled) {
    for (let py = y; py < y + height; py += 1) line(x, py, x + width - 1, py);
  } else {
    line(x, y, x + width - 1, y);
    line(x, y + height - 1, x + width - 1, y + height - 1);
    line(x, y, x, y + height - 1);
    line(x + width - 1, y, x + width - 1, y + height - 1);
  }
}

function circle(cx, cy, radius) {
  let x = radius;
  let y = 0;
  let error = 0;
  while (x >= y) {
    [[x,y],[y,x],[-y,x],[-x,y],[-x,-y],[-y,-x],[y,-x],[x,-y]].forEach(([dx,dy]) => {
      const px = cx + dx, py = cy + dy;
      if (px >= 0 && py >= 0 && px < columns && py < rows) matrix[py][px] = 1;
    });
    y += 1;
    if (error <= 0) error += 2 * y + 1;
    if (error > 0) { x -= 1; error -= 2 * x + 1; }
  }
}

function drawDigit(x, y, digit, scale = 1) {
  const patterns = {
    "0": ["111","101","101","101","111"],
    "1": ["010","110","010","010","111"],
    "2": ["111","001","111","100","111"],
    "3": ["111","001","111","001","111"],
    "4": ["101","101","111","001","001"],
    "5": ["111","100","111","001","111"],
    "6": ["111","100","111","101","111"],
    "7": ["111","001","010","010","010"],
    "8": ["111","101","111","101","111"],
    "9": ["111","101","111","001","111"]
  };
  const pattern = patterns[digit];
  if (!pattern) return;
  pattern.forEach((row, py) => [...row].forEach((cell, px) => {
    if (cell === "1") rect(x + px * scale, y + py * scale, scale, scale, true);
  }));
}

function fitPoint(nx, ny) {
  return [Math.round(nx * (columns - 1)), Math.round(ny * (rows - 1))];
}

const presets = {
  weather() {
    matrix = emptyMatrix(columns, rows);
    const [cx, cy] = fitPoint(0.27, 0.5);
    const radius = Math.max(3, Math.round(Math.min(columns, rows) * 0.15));
    circle(cx, cy, radius);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      line(
        Math.round(cx + Math.cos(angle) * (radius + 2)),
        Math.round(cy + Math.sin(angle) * (radius + 2)),
        Math.round(cx + Math.cos(angle) * (radius + 5)),
        Math.round(cy + Math.sin(angle) * (radius + 5))
      );
    }
    const scale = Math.max(1, Math.floor(rows / 12));
    const startX = Math.round(columns * 0.58);
    const startY = Math.round(rows * 0.35);
    drawDigit(startX, startY, "2", scale);
    drawDigit(startX + 4 * scale, startY, "4", scale);
    circle(startX + 8 * scale, startY + scale, Math.max(1, scale));
    speechText.value = "Today, sunny, 24 degrees.";
    activePresetElement.textContent = "Weather: sunny, 24 degrees";
  },
  calendar() {
    matrix = emptyMatrix(columns, rows);
    const x = Math.round(columns * .12), y = Math.round(rows * .18);
    const w = Math.round(columns * .36), h = Math.round(rows * .62);
    rect(x, y, w, h);
    line(x, y + Math.round(h * .25), x + w - 1, y + Math.round(h * .25));
    line(x + Math.round(w * .25), y - 2, x + Math.round(w * .25), y + 2);
    line(x + Math.round(w * .75), y - 2, x + Math.round(w * .75), y + 2);
    const scale = Math.max(1, Math.floor(rows / 14));
    drawDigit(Math.round(columns * .58), Math.round(rows * .28), "1", scale);
    drawDigit(Math.round(columns * .58) + 4 * scale, Math.round(rows * .28), "4", scale);
    const iconX = Math.round(columns * .78), iconY = Math.round(rows * .56);
    circle(iconX, iconY - 3, 2);
    line(iconX, iconY - 1, iconX, iconY + 4);
    line(iconX, iconY + 1, iconX - 4, iconY + 4);
    line(iconX, iconY + 1, iconX + 4, iconY + 4);
    speechText.value = "Next event: project meeting at 2 PM.";
    activePresetElement.textContent = "Calendar: 2 PM meeting";
  },
  notification() {
    matrix = emptyMatrix(columns, rows);
    const x = Math.round(columns * .16), y = Math.round(rows * .25);
    const w = Math.round(columns * .55), h = Math.round(rows * .5);
    rect(x, y, w, h);
    line(x, y, x + Math.floor(w / 2), y + Math.floor(h / 2));
    line(x + w - 1, y, x + Math.floor(w / 2), y + Math.floor(h / 2));
    circle(Math.round(columns * .83), Math.round(rows * .3), 3);
    speechText.value = "New message from the project group.";
    activePresetElement.textContent = "Notification: new message";
  },
  news() {
    matrix = emptyMatrix(columns, rows);
    const x = Math.round(columns * .12), y = Math.round(rows * .17);
    const w = Math.round(columns * .72), h = Math.round(rows * .66);
    rect(x, y, w, h);
    rect(x + 3, y + 4, Math.round(w * .32), Math.round(h * .42));
    for (let offset = 4; offset < h - 2; offset += 4) {
      line(x + Math.round(w * .42), y + offset, x + w - 3, y + offset);
    }
    line(x + 3, y + Math.round(h * .62), x + Math.round(w * .36), y + Math.round(h * .62));
    line(x + 3, y + Math.round(h * .78), x + Math.round(w * .36), y + Math.round(h * .78));
    speechText.value = "Top news: public transport service returns to normal today.";
    activePresetElement.textContent = "News: transport update";
  },
  school() {
    matrix = emptyMatrix(columns, rows);
    const cx = Math.round(columns * .22), roofY = Math.round(rows * .2);
    line(cx - 7, roofY + 5, cx, roofY);
    line(cx, roofY, cx + 7, roofY + 5);
    rect(cx - 6, roofY + 5, 13, 10);
    rect(cx - 2, roofY + 10, 4, 5);
    const arrowY = Math.round(rows * .5);
    line(Math.round(columns * .43), arrowY, Math.round(columns * .58), arrowY);
    line(Math.round(columns * .58), arrowY, Math.round(columns * .53), arrowY - 4);
    line(Math.round(columns * .58), arrowY, Math.round(columns * .53), arrowY + 4);
    const scale = Math.max(1, Math.floor(rows / 14));
    drawDigit(Math.round(columns * .68), Math.round(rows * .32), "2", scale);
    drawDigit(Math.round(columns * .68) + 4 * scale, Math.round(rows * .32), "0", scale);
    drawDigit(Math.round(columns * .68) + 8 * scale, Math.round(rows * .32), "4", scale);
    speechText.value = "Your 2 PM lecture has moved to room B204.";
    activePresetElement.textContent = "School alert: room change";
  }
};

gridElement.addEventListener("pointerdown", event => {
  const dot = event.target.closest(".dot");
  if (!dot) return;
  pointerDown = true;
  gridElement.setPointerCapture(event.pointerId);
  cursor = { x: Number(dot.dataset.x), y: Number(dot.dataset.y) };
  paint(cursor.x, cursor.y);
});

gridElement.addEventListener("pointermove", event => {
  if (!pointerDown) return;
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const dot = element?.closest(".dot");
  if (!dot || !gridElement.contains(dot)) return;
  cursor = { x: Number(dot.dataset.x), y: Number(dot.dataset.y) };
  paint(cursor.x, cursor.y);
});

window.addEventListener("pointerup", () => { pointerDown = false; });

gridElement.addEventListener("keydown", event => {
  const previous = { ...cursor };
  if (event.key === "ArrowLeft") cursor.x = Math.max(0, cursor.x - 1);
  else if (event.key === "ArrowRight") cursor.x = Math.min(columns - 1, cursor.x + 1);
  else if (event.key === "ArrowUp") cursor.y = Math.max(0, cursor.y - 1);
  else if (event.key === "ArrowDown") cursor.y = Math.min(rows - 1, cursor.y + 1);
  else if (event.key === " ") {
    event.preventDefault();
    matrix[cursor.y][cursor.x] = matrix[cursor.y][cursor.x] ? 0 : 1;
    updateDot(cursor.x, cursor.y);
    announce(matrix[cursor.y][cursor.x] ? "Dot raised" : "Dot lowered");
    return;
  } else if (event.key.toLowerCase() === "d") { setMode("draw"); return; }
  else if (event.key.toLowerCase() === "e") { setMode("erase"); return; }
  else return;
  event.preventDefault();
  updateDot(previous.x, previous.y);
  updateDot(cursor.x, cursor.y);
});

resizeButton.addEventListener("click", () => {
  createGrid(columnsInput.value, rowsInput.value);
  activePresetElement.textContent = "Custom pictogram";
  announce(`Grid resized to ${columns} by ${rows}`);
});
drawButton.addEventListener("click", () => setMode("draw"));
eraseButton.addEventListener("click", () => setMode("erase"));
brushInput.addEventListener("input", () => { brushOutput.value = brushInput.value; });
clearButton.addEventListener("click", () => {
  matrix = emptyMatrix(columns, rows);
  activePresetElement.textContent = "Custom pictogram";
  render();
  announce("Grid cleared");
});
invertButton.addEventListener("click", () => {
  matrix = matrix.map(row => row.map(value => value ? 0 : 1));
  render();
  announce("Grid inverted");
});

document.querySelectorAll(".preset").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.preset;
    presets[name]();
    render();
    announce(`${button.textContent.trim()} example loaded`);
  });
});

speakButton.addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    announce("Speech synthesis is not supported in this browser");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speechText.value.trim());
  utterance.lang = "en-US";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
  announce("Playing audio summary");
});
stopSpeechButton.addEventListener("click", () => {
  window.speechSynthesis?.cancel();
  announce("Audio stopped");
});

downloadButton.addEventListener("click", () => {
  const payload = {
    format: "tactibrief-virtual-dotpad-v1",
    columns,
    rows,
    title: activePresetElement.textContent,
    speech: speechText.value,
    matrix
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tactibrief-pictogram.json";
  link.click();
  URL.revokeObjectURL(url);
  announce("JSON exported");
});

uploadInput.addEventListener("change", async () => {
  const file = uploadInput.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.matrix) || !data.columns || !data.rows) throw new Error("Invalid format");
    createGrid(data.columns, data.rows);
    matrix = data.matrix.slice(0, rows).map(row => row.slice(0, columns).map(value => value ? 1 : 0));
    while (matrix.length < rows) matrix.push(Array(columns).fill(0));
    matrix = matrix.map(row => [...row, ...Array(Math.max(0, columns - row.length)).fill(0)].slice(0, columns));
    speechText.value = data.speech || "";
    activePresetElement.textContent = data.title || "Imported pictogram";
    render();
    announce("JSON imported");
  } catch (error) {
    announce("Could not import this JSON file");
  } finally {
    uploadInput.value = "";
  }
});

createGrid();
presets.weather();
render();
