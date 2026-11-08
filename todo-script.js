let tasks = JSON.parse(localStorage.getItem("taskflow_pro_tasks") || "[]");
let filter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const countAll = document.getElementById("countAll");
const countActive = document.getElementById("countActive");
const countCompleted = document.getElementById("countCompleted");

function save() {
  localStorage.setItem("taskflow_pro_tasks", JSON.stringify(tasks));
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  taskList.innerHTML = "";
  let list = tasks;
  if (filter === "active") list = tasks.filter((t) => !t.done);
  if (filter === "completed") list = tasks.filter((t) => t.done);

  if (list.length === 0) {
    const msg =
      filter === "all"
        ? "No tasks yet. Add your first task!"
        : filter === "active"
          ? "No active tasks. Great job!"
          : "No completed tasks yet.";
    const icon =
      filter === "all"
        ? "fa-clipboard-list"
        : filter === "active"
          ? "fa-check-circle"
          : "fa-hourglass-half";
    taskList.innerHTML = `<div class="empty"><i class="fas ${icon}"></i><h3>Nothing here</h3><p>${msg}</p></div>`;
  } else {
    list.forEach((t) => {
      const div = document.createElement("div");
      div.className = "task" + (t.done ? " done" : "");
      div.innerHTML = `
        <div class="task-check" data-id="${t.id}">${t.done ? '<i class="fas fa-check"></i>' : ""}</div>
        <span class="task-text">${escapeHtml(t.text)}</span>
        <button class="task-del" data-id="${t.id}" title="Delete" aria-label="Delete"><i class="fas fa-trash"></i></button>`;
      taskList.appendChild(div);
    });
  }
  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const active = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = `${done} of ${total} completed`;
  progressPercent.textContent = pct + "%";
  taskCount.innerHTML = `<strong>${active}</strong> task${active !== 1 ? "s" : ""} left`;
  countAll.textContent = total;
  countActive.textContent = active;
  countCompleted.textContent = done;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }
  tasks.unshift({ id: Date.now(), text, done: false });
  taskInput.value = "";
  save();
  render();
  taskInput.focus();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  const check = e.target.closest(".task-check");
  const del = e.target.closest(".task-del");
  if (check) {
    const id = Number(check.dataset.id);
    const t = tasks.find((x) => x.id === id);
    if (t) t.done = !t.done;
    save();
    render();
  }
  if (del) {
    const id = Number(del.dataset.id);
    tasks = tasks.filter((x) => x.id !== id);
    save();
    render();
  }
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener("click", () => {
  if (tasks.filter((t) => t.done).length === 0) return;
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();