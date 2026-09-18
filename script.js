// TO DO LIST APP
// simple project - task add, edit, delete, complete karne ke liye

var tasks = [];
var currentFilter = "all";

// pehle localStorage se purana data load kar lo
var savedData = localStorage.getItem('tasks');
if (savedData != null) {
  tasks = JSON.parse(savedData);
}

var taskInput = document.getElementById('taskInput');
var addBtn = document.getElementById('addBtn');
var taskList = document.getElementById('taskList');
var errorMsg = document.getElementById('errorMsg');

// function jo tasks ko localStorage me save karega
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// upar wale counters (total, pending, complete) update karne ke liye
function updateStats() {
  var total = tasks.length;
  var pending = 0;
  var completed = 0;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].completed == true) {
      completed = completed + 1;
    } else {
      pending = pending + 1;
    }
  }

  document.getElementById('totalCount').innerHTML = total;
  document.getElementById('totalPending').innerHTML = pending;
  document.getElementById('totalCompleted').innerHTML = completed;
}

// text ko safe karne ke liye taaki koi html tag issue na kare
function escapeHtml(text) {
  var div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// sara list dobara draw karne ke liye
function renderTasks() {
  taskList.innerHTML = "";

  var showTasks = [];

  for (var i = 0; i < tasks.length; i++) {
    if (currentFilter == "all") {
      showTasks.push(tasks[i]);
    }
    else if (currentFilter == "pending" && tasks[i].completed == false) {
      showTasks.push(tasks[i]);
    }
    else if (currentFilter == "completed" && tasks[i].completed == true) {
      showTasks.push(tasks[i]);
    }
  }

  if (showTasks.length == 0) {
    taskList.innerHTML = "<li class='empty-tabs'>No tasks here. Add one to get started!</li>";
    updateStats();
    return;
  }

  for (var j = 0; j < showTasks.length; j++) {
    var task = showTasks[j];

    var liClass = "task-item";
    if (task.completed == true) {
      liClass = "task-item completed";
    }

    var isChecked = "";
    if (task.completed == true) {
      isChecked = "checked";
    }

    var html = "";
    html += "<li class='" + liClass + "' data-id='" + task.id + "'>";
    html += "<input type='checkbox' class='task-checkbox' " + isChecked + " onchange='toggleTask(" + task.id + ")'>";
    html += "<span class='task-text'>" + escapeHtml(task.text) + "</span>";
    html += "<div class='task-actions'>";
    html += "<button class='edit-btn' onclick='editTask(" + task.id + ")'>✏️</button>";
    html += "<button class='delete-btn' onclick='deleteTask(" + task.id + ")'>🗑️</button>";
    html += "</div>";
    html += "</li>";

    taskList.innerHTML += html;
  }

  updateStats();
}

// naya task add karne ka function
function addTask() {
  var text = taskInput.value.trim();

  if (text == "") {
    errorMsg.style.display = "block";
    return;
  }
  errorMsg.style.display = "none";

  var newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";

  saveTasks();
  renderTasks();
}

// checkbox click hone par task complete/pending karna
function toggleTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].completed = !tasks[i].completed;
    }
  }
  saveTasks();
  renderTasks();
}

// task delete karne ka function
function deleteTask(id) {
  var newTasks = [];
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id != id) {
      newTasks.push(tasks[i]);
    }
  }
  tasks = newTasks;
  saveTasks();
  renderTasks();
}

// task edit karne ka function - prompt box use kar rahe hai simple tarike se
function editTask(id) {
  var task = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      task = tasks[i];
    }
  }

  var newText = prompt("Edit your task:", task.text);

  if (newText != null && newText.trim() != "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// add button click
addBtn.addEventListener('click', function() {
  addTask();
});

// enter key se bhi add ho jaye
taskInput.addEventListener('keypress', function(e) {
  if (e.key == "Enter") {
    addTask();
  }
});

// typing shuru karte hi error hata do
taskInput.addEventListener('input', function() {
  errorMsg.style.display = "none";
});

// filter buttons ka kaam
var filterBtns = document.querySelectorAll('.activeBtn');

for (var k = 0; k < filterBtns.length; k++) {
  filterBtns[k].addEventListener('click', function() {

    for (var m = 0; m < filterBtns.length; m++) {
      filterBtns[m].classList.remove('active');
    }
    this.classList.add('active');

    currentFilter = this.getAttribute('data-filter');
    renderTasks();
  });
}

// page load hote hi list dikha do
renderTasks();
