/* Navigation */
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  document.querySelectorAll('nav button').forEach(function (b) { b.classList.remove('active'); });
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
}

/* Fortune Generator */
let fortunes = [];

const fontColors   = ["#c0392b", "#27ae60", "#2980b9", "#8e44ad", "#e67e22"];
const bgColors     = ["#fff8f0", "#f0fff4", "#f0f8ff", "#fdf0ff", "#fffff0"];
const borderColors = ["#e67e22", "#27ae60", "#2980b9", "#8e44ad", "#c0392b"];
const fontStyles   = [
  { size: "1.3rem",  family: "Georgia, serif" },
  { size: "1.35rem", family: "Arial, sans-serif" },
  { size: "1.2rem",  family: "'Courier New', monospace" },
  { size: "1.4rem",  family: "Verdana, sans-serif" },
  { size: "1.3rem",  family: "Tahoma, sans-serif" }
];

let fontColorIdx = 0, bgColorIdx = 0, borderColorIdx = 0, fontStyleIdx = 0;

function loadFortunes() {
  return fetch("fortunes.txt")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (text) {
      fortunes = text.split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line.length > 0; });
    });
}

function showFortune() {
  const box = document.getElementById("fortune-box");
  if (fortunes.length === 0) {
    box.textContent = "Could not load fortunes.txt. Open the page via a local server.";
    return;
  }
  const idx = Math.floor(Math.random() * fortunes.length);
  box.textContent = fortunes[idx];
}

function cycleFontColor() {
  fontColorIdx = (fontColorIdx + 1) % fontColors.length;
  document.getElementById("fortune-box").style.color = fontColors[fontColorIdx];
}

function cycleBgColor() {
  bgColorIdx = (bgColorIdx + 1) % bgColors.length;
  document.getElementById("fortune-box").style.backgroundColor = bgColors[bgColorIdx];
}

function cycleBorderColor() {
  borderColorIdx = (borderColorIdx + 1) % borderColors.length;
  document.getElementById("fortune-box").style.borderColor = borderColors[borderColorIdx];
}

function cycleFontStyle() {
  fontStyleIdx = (fontStyleIdx + 1) % fontStyles.length;
  const box = document.getElementById("fortune-box");
  box.style.fontSize   = fontStyles[fontStyleIdx].size;
  box.style.fontFamily = fontStyles[fontStyleIdx].family;
}

loadFortunes().catch(function () {}).then(showFortune);

/* Stopwatch */
let elapsed  = 0;
let interval = null;
const MAX_TIME = 30;
const STEP     = 3;

function updateDisplay() {
  document.getElementById("timer-display").textContent = elapsed + " s";
}

function startTimer() {
  if (interval !== null) return;
  if (elapsed >= MAX_TIME) return;
  document.getElementById("timer-status").textContent = "";
  interval = setInterval(function () {
    elapsed += STEP;
    updateDisplay();
    if (elapsed >= MAX_TIME) {
      clearInterval(interval);
      interval = null;
      elapsed = MAX_TIME;
      updateDisplay();
      document.getElementById("timer-status").textContent = "Reached 30 s. Timer stopped.";
    }
  }, STEP * 1000);
}

function stopTimer() {
  if (interval === null) return;
  clearInterval(interval);
  interval = null;
  document.getElementById("timer-status").textContent =
    "Paused at " + elapsed + " s. Press Start to resume.";
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  elapsed  = 0;
  updateDisplay();
  document.getElementById("timer-status").textContent = "";
}

/* To-Do List */
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  const list  = document.getElementById("todo-list");
  const empty = document.getElementById("todo-empty");
  list.innerHTML = "";

  if (tasks.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox    = document.createElement("input");
    checkbox.type     = "checkbox";
    checkbox.checked  = task.done;
    checkbox.addEventListener("change", function () {
      const t = loadTasks();
      t[index].done = checkbox.checked;
      saveTasks(t);
      renderTasks();
    });

    const span       = document.createElement("span");
    span.className   = "task-text";
    span.textContent = task.text;

    const delBtn       = document.createElement("button");
    delBtn.className   = "btn-delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", function () {
      const t = loadTasks();
      t.splice(index, 1);
      saveTasks(t);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("todo-input");
  const text  = input.value.trim();
  if (!text) return;
  const tasks = loadTasks();
  tasks.push({ text: text, done: false });
  saveTasks(tasks);
  input.value = "";
  renderTasks();
}

document.getElementById("todo-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

renderTasks();
