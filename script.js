// TO DO LIST APP

var tasks = [];
var currentFilter = "all";

// localStorage se purana data load 
var savedData = localStorage.getItem('tasks');
if (savedData != null) {
  tasks = JSON.parse(savedData);
}

var taskInput = document.getElementById('taskInput');
var addBtn = document.getElementById('addBtn');
var taskList = document.getElementById('taskList');
var errorMsg = document.getElementById('errorMsg');

// function store task in localstorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// (total, pending, complete) update karne ke liye
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

// text ko safety
function escapeHtml(text) {
  var div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// re-listing
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

// new task adding 
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

// checkbox click 
function toggleTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].completed = !tasks[i].completed;
    }
  }
  saveTasks();
  renderTasks();
}

// delete task
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

// edit task
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

// enter key eding
taskInput.addEventListener('keypress', function(e) {
  if (e.key == "Enter") {
    addTask();
  }
});

// remove error
taskInput.addEventListener('input', function() {
  errorMsg.style.display = "none";
});

// filter buttons 
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

// reload and show again
renderTasks();
