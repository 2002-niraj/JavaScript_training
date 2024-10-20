const taskText = document.querySelector('#inputtext');
const addBtn = document.querySelector('#addbtn');
const taskList = document.querySelector('.tasklist');
const clearBtn = document.querySelector('#clear-btn');

const allTaskBtn = document.getElementById('alltask');
const pendingTaskBtn = document.getElementById('pendingtask');
const completedTaskBtn = document.getElementById('completedtask');

if (!localStorage.getItem('hasLoaded')) {
    localStorage.clear();
    localStorage.setItem('hasLoaded', 'true');
}

document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.task, task.status));
}

addBtn.addEventListener('click', () => {
    const text = taskText.value.trim();
    if (text) {
        createTaskElement(text, 'pending');
        saveTaskToLocalStorage(text, 'pending');
        taskText.value = '';
    } else {
        alert('Please enter a task.');
    }
});

// 
function createTaskElement(text, status) {
    const li = document.createElement('li');
    li.setAttribute("class", "task");

    li.innerHTML = `<label>
            <input type="checkbox" ${status === 'completed' ? 'checked' : ''}>
            <p contenteditable="false">${text}</p>
        </label>
        <div class="task-actions">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    const editBtn = li.querySelector('.edit-btn');
    const taskParagraph = li.querySelector('p');
    const deleteBtn = li.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => {
        const isEditing = taskParagraph.isContentEditable;
        taskParagraph.contentEditable = !isEditing;
        taskParagraph.focus();

        if (!isEditing) {
            editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            updateTaskInLocalStorage(text, taskParagraph.innerText, status);
            text = taskParagraph.innerText;
        }
    });

    checkbox.addEventListener('change', () => {
    
        if(checkbox.checked){
          li.setAttribute("class","task completed")
          updateTaskInLocalStorage(text, taskParagraph.innerText, "completed");
        }
        else{
          li.setAttribute("class","task")
          updateTaskInLocalStorage(text, taskParagraph.innerText, "pending");
        }
        
    });

    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
        removeTaskFromLocalStorage(text);
        clearAllVisibility();
    });

    taskList.appendChild(li);
    clearAllVisibility();
}

function clearAllVisibility() {
    const taskitems = taskList.children;
    if (taskitems.length > 0) {
        clearBtn.style.display = 'block';
        allTaskBtn.style.display = 'block';
        pendingTaskBtn.style.display = 'block';
        completedTaskBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
        allTaskBtn.style.display = 'none';
        pendingTaskBtn.style.display = 'none';
        completedTaskBtn.style.display = 'none';
    }
}

function saveTaskToLocalStorage(text, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ task: text, status });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(oldText, newText, newStatus) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task =>
        task.task === oldText ? { task: newText, status: newStatus } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function removeTaskFromLocalStorage(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.task !== text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        clearAllVisibility();
    }
});

allTaskBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.style.display = 'flex';
    });
});

pendingTaskBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        task.style.display = checkbox.checked ? 'none' : 'flex';
    });
});

completedTaskBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        task.style.display = checkbox.checked ? 'flex' : 'none';
    });
});
