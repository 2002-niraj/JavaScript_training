
//add task
function addTask(){

    let text = document.getElementById('inputtext').value
    document.getElementById('inputtext').value = " ";
    if(text == "" || text == null || text==" "){
        alert("task must be filled out");
        return;
    }
    else{
        const span = document.createElement('span')
        const tick = document.createElement('i')
        const cross = document.createElement('i')
        const li = document.createElement('li')
        tick.setAttribute("class","fa-regular fa-circle-check")
        tick.setAttribute("id","tick")
        cross.setAttribute("class","fa-regular fa-circle-xmark")
        cross.setAttribute("id","cross")
        console.log(tick)
        span.innerText = `${text}`
        console.log(cross)
        li.appendChild(tick)
        li.appendChild(span)
        li.appendChild(cross)
        const list = document.querySelector('#list')
        list.appendChild(li)
        document.getElementById('dele_btn').style.display = "block"
        console.log("added sucessfully")
    }
}

// remove all tasks
function removeAllTask(){
  
    let tasks = document.querySelectorAll('#list')
    tasks.forEach(function(task){
        task.remove();
        document.getElementById('dele_btn').style.display = "none"
    })
}

// remove one task

function removetask(){
    

}
let list = document.querySelectorAll('li')
