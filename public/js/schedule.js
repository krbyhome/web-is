document.addEventListener("DOMContentLoaded", initialize);

const dayToIndex = {
  'Понедельник': 0,
  'Вторник': 1,
  'Среда': 2,
  'Четверг': 3,
  'Пятница': 4,
};

let schedule = new Map();

function initialize() {
  loadLocalStorage();
  renderSchedule();
  setupEventForm();
}

function setupEventForm() {
  const form = document.querySelector("#eventForm");
  form.addEventListener("submit", submitHandler);
}

function submitHandler(event) {
  event.preventDefault();
  
  const day = document.querySelector("#form-day-select").value;
  const taskDescription = document.getElementById("event-input").value;

  addTaskToSchedule(day, taskDescription);
  saveScheduleToLocalStorage();
  renderTask(day, taskDescription);
}

function addTaskToSchedule(day, task) {
  if (!schedule.has(day)) {
    schedule.set(day, []);
  }
  schedule.get(day).push(task);
}

function saveScheduleToLocalStorage() {
  const scheduleObject = Object.fromEntries(schedule);
  window.localStorage.setItem("schedule", JSON.stringify(scheduleObject));
}

function loadLocalStorage() {
  const storedSchedule = window.localStorage.getItem("schedule");
  if (storedSchedule) {
    schedule = new Map(Object.entries(JSON.parse(storedSchedule)));
  }
}

function renderSchedule() {
  const dayContainers = document.querySelectorAll(".main__field");
  schedule.forEach((tasks, day) => {
    const container = dayContainers[dayToIndex[day]];
    tasks.forEach(task => renderTask(day, task, container));
  });
}

function renderTask(day, taskDescription, container = null) {
  const dayContainers = document.querySelectorAll(".main__field");
  if (!container) {
    container = dayContainers[dayToIndex[day]];
  }

  const taskElement = document.createElement("div");
  taskElement.textContent = taskDescription;
  taskElement.classList.add("event-item");

  container.appendChild(taskElement);
}