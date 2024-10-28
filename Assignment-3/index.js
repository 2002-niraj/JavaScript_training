const taskText = document.querySelector("#text");
const prioritySelect = document.querySelector("#priority");
const categorySelect = document.querySelector("#Categories");
const addBtn = document.querySelector("#addbtn");
const activeTaskList = document.querySelector("#activeTasksList");
const completedTaskList = document.querySelector("#completedTasksList");
const clearBtn = document.querySelector("#clear-btn");

const defaultCompletMsg = document.createElement('p');
defaultCompletMsg.innerHTML = 'No tasks completed yet!';
completedTaskList.parentNode.append(defaultCompletMsg);

const defaultActiveMsg = document.createElement('p');
defaultActiveMsg.innerHTML = 'No active tasks yet!';
activeTaskList.parentNode.append(defaultActiveMsg);

if (!localStorage.getItem("hasLoaded")) {
    localStorage.clear();
    localStorage.setItem("hasLoaded", "true");
}

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
        createTaskElement(task.task, task.status, task.priority, task.category);
    });
    taskStatus();
}

addBtn.addEventListener("click", () => {
    const text = taskText.value.trim();
    const priority = prioritySelect.value;
    const category = categorySelect.value;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (text.length === 0 || !/^[a-zA-Z]/.test(text)) {
        alert("Task text must start with a letter.");
        return;
    }

    if (text.length > 80) {
        alert("Task text must be 80 characters or less");
        return;
    }

    if (text) {
        const existingTask = tasks.find(task => task.task.toLowerCase() === text.toLowerCase());
        if (!existingTask) {
            createTaskElement(text, "active", priority, category);
            saveTaskToLocalStorage(text, "active", priority, category);
            taskText.value = "";
            prioritySelect.value = "";
            categorySelect.value = "";
        } else {
            alert("Task already exists.");
            taskText.value = "";
            prioritySelect.value = "";
            categorySelect.value = "";
            return;
        }
    }
});

function createTaskElement(text, status, priority, category) {
    const li = document.createElement("li");
    li.setAttribute("class", "task");

    li.innerHTML = `
        <label>
            <input type="checkbox" ${status === "completed" ? "checked" : ""}>
            <input type="text" class="task-input" value="${text}" ${status === "completed" ? "disabled" : "readonly"}>
            <select class="priority-select" disabled>
                <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
                <option value="medium" ${priority === "medium" ? "selected" : ""}>Medium</option>
                <option value="high" ${priority === "high" ? "selected" : ""}>High</option>
            </select>
            <span class="category">[${category}]</span>
        </label>
        <div class="task-actions">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;


    const checkbox = li.querySelector('input[type="checkbox"]');
    const editBtn = li.querySelector(".edit-btn");
    const taskInput = li.querySelector(".task-input");
    const prioritySelect = li.querySelector(".priority-select");
    const deleteBtn = li.querySelector(".delete-btn");

    if (status === "completed") {
        li.setAttribute("class", "task completed");
        checkbox.disabled = true;
        completedTaskList.prepend(li);
    } else {
        activeTaskList.prepend(li);
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            li.setAttribute("class", "task completed");
            completedTaskList.prepend(li);
            taskStatus();
            checkbox.disabled = true;
            updateTaskInLocalStorage(text, taskInput.value, "completed", priority, category);
            alert("This task is completed");
        }    
    });

    editBtn.addEventListener("click", () => {
        if (checkbox.checked) {
            alert("You can't edit completed tasks!");
        } else {
            const isEditing = taskInput.readOnly;
    
            if (isEditing) {
                taskInput.readOnly = false;
                prioritySelect.disabled = false; 
                editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                taskInput.focus();
            } else {

                const newText = taskInput.value.trim();
                const newPriority = prioritySelect.value;
    
                let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                
               tasks = tasks.filter((task) => task.task !== newText);
                   

                if (newText.length === 0 || !/^[a-zA-Z]/.test(newText)) {
                    alert("Task text must start with a letter.");
                    return;
                }
    
                if (newText.length > 80) {
                    alert("Task text must be 80 characters or less");
                    return;
                }

                const existingTask = tasks.find(task => task.task.toLowerCase() === newText.toLowerCase());
                if (existingTask) {
                    alert("Task already exists.");
                    return;
                }
                
                taskInput.readOnly = true;
                prioritySelect.disabled = true;
                editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
                updateTaskInLocalStorage(text, newText, status, newPriority, category);
                alert("Edited successfully!");
            }
        }
    });

    deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
            li.remove();
            taskStatus();
            removeTaskFromLocalStorage(text);
        }
    });

    taskStatus();
}

function taskStatus(){
    const completedTasks = completedTaskList.children;
    const activeTasks = activeTaskList.children;

    if(completedTasks.length === 0 && activeTasks.length === 0 ){
       clearBtn.style.display = 'none';
    } else {
         clearBtn.style.display = 'block';
    }

    defaultCompletMsg.style.display = completedTasks.length === 0 ? 'block' : 'none';
    defaultActiveMsg.style.display = activeTasks.length === 0 ? 'block' : 'none';
}

function saveTaskToLocalStorage(text, status, priority, category) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ task: text, status, priority, category });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(oldText, newText, Status, Priority, Category) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map((task) =>
        task.task === oldText ? { task: newText, status: Status, priority: Priority, category: Category } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function removeTaskFromLocalStorage(text) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.filter((task) => task.task !== text);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all active and completed tasks?")) {
        activeTaskList.innerHTML = "";
        completedTaskList.innerHTML = "";
        localStorage.removeItem("tasks");
        taskStatus();
    }
});