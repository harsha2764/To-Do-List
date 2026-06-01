
/* =========================
   STATE MANAGEMENT
========================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* =========================
   DOM ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll("[data-filter]");

/* =========================
   SAVE TO LOCAL STORAGE
========================= */

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}" 
            data-id="${task.id}">
        ${task.text}
      </span>

      <div>
        <button class="completeBtn" data-id="${task.id}">✔</button>
        <button class="deleteBtn" data-id="${task.id}">✖</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

/* =========================
   ADD TASK (CREATE)
========================= */

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);

  taskInput.value = "";

  saveTasks();
  renderTasks();
});

/* =========================
   EVENT DELEGATION (UPDATE + DELETE)
========================= */

taskList.addEventListener("click", (e) => {

  const id = Number(e.target.dataset.id);

  // DELETE
  if (e.target.classList.contains("deleteBtn")) {
    tasks = tasks.filter(task => task.id !== id);
  }

  // TOGGLE COMPLETE
  if (e.target.classList.contains("completeBtn")) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }

  saveTasks();
  renderTasks();
});

/* =========================
   FILTER SYSTEM
========================= */

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* =========================
   INITIAL LOAD
========================= */

renderTasks();