// ==============================
// Cherrie 🍒 Chat Functionality
// ==============================


async function sendMessage() {

    const input = document.getElementById("user-message");
    const chatBox = document.getElementById("chat-container");


    const message = input.value.trim();


    if (!message) return;


    // Show user message
    chatBox.innerHTML += `
        <div class="user-msg">
            ${message}
        </div>
    `;


    input.value = "";


    // Temporary thinking message
    chatBox.innerHTML += `
        <div class="ai-msg thinking">
            🍒 Cherrie is thinking...
        </div>
    `;


    chatBox.scrollTop = chatBox.scrollHeight;



    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });



        const data = await response.json();



        // Remove thinking message
        const thinking = document.querySelector(".thinking");

        if (thinking) {
            thinking.remove();
        }



        // Add AI response
        chatBox.innerHTML += `
    <div class="ai-msg">
        🍒 ${marked.parse(data.reply)}
    </div>
`;


    }


    catch(error) {

        console.error(error);


        chatBox.innerHTML += `
            <div class="ai-msg">
                🍒 Oops... I couldn't connect right now.
            </div>
        `;

    }


    chatBox.scrollTop = chatBox.scrollHeight;

}

// ==============================
// 🍒 Load Chat History
// ==============================

async function loadChatHistory(){

    const chatBox = document.getElementById(
        "chat-container"
    );


    if(!chatBox) return;


    const response = await fetch(
        "/api/chat/history"
    );


    const chats = await response.json();


    chatBox.innerHTML = "";


    chats.forEach(chat=>{


        chatBox.innerHTML += `

        <div class="user-msg">

            ${chat.user_message}

        </div>


        <div class="ai-msg">

            🍒 ${marked.parse(chat.ai_reply)}

        </div>

        `;


    });


    chatBox.scrollTop = chatBox.scrollHeight;

}

// Press Enter to send message
document.addEventListener("DOMContentLoaded", () => {


    const input = document.getElementById("user-message");


    if(input){

        input.addEventListener("keypress", function(event){


            if(event.key === "Enter"){

                sendMessage();

            }


        });

    }
loadChatHistory();

});
// ==============================
// 🍅 Pomodoro Timer
// ==============================

let timer = null;
let timeLeft = 25 * 60;
let pomodoros = 0;

function updateTimer(){

    const display = document.getElementById("timer");

    if(display){

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        display.innerText =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    }

}

function pauseTimer(){

    clearInterval(timer);

    timer = null;

}

function startTimer(){

    if(timer !== null) return;


    timer = setInterval(() => {

        if(timeLeft <= 0){

            clearInterval(timer);
            timer = null;

            pomodoros++;

            document.getElementById("pomodoro-count").innerText = pomodoros;

            alert("Focus session complete 🍒✨");
            return;

        }


        timeLeft--;

        updateTimer();


    },1000);

}



function resetTimer(){

    clearInterval(timer);

    timer = null;

    timeLeft = 25 * 60;

    updateTimer();

}
// ==============================
// 📅 Planner
// ==============================

async function addTask(){

    const input = document.getElementById("task-input");

    if(!input.value.trim()) return;


    await fetch("/api/tasks", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            task:input.value
        })

    });


    input.value="";

    loadTasks();

}



// ==============================
// 🌸 Planner Display
// ==============================

async function loadTasks(){

    const response = await fetch("/api/tasks");

    const tasks = await response.json();


    const list = document.getElementById("task-list");


    if(!list) return;


    list.innerHTML = "";


    tasks.forEach(task => {

    list.innerHTML += `

    <div class="task-item ${task.completed ? 'done' : ''}">

        <label class="cute-check">

            <input 
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id}, this)"
            >

            <span class="checkmark"></span>

        </label>


        <span class="task-text">
            ${task.task}
        </span>


        <button 
            class="delete-task"
            onclick="deleteTask(${task.id})">

            🗑️

        </button>


    </div>

    `;

});

}

// ☑️ Complete Task

async function toggleTask(id, checkbox){

    await fetch(`/api/tasks/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            completed: checkbox.checked ? 1 : 0

        })

    });


    loadTasks();

}



// 🗑️ Delete Task

async function deleteTask(id){

    await fetch(`/api/tasks/${id}`, {

        method:"DELETE"

    });


    loadTasks();

}

document.addEventListener("DOMContentLoaded", ()=>{

    if(document.getElementById("task-list")){

        loadTasks();

    }

});


// ==============================
// 🌱 Habits
// ==============================


async function addHabit(){

    const input = document.getElementById("habit-input");


    if(!input.value.trim()) return;


    await fetch("/api/habits", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            habit: input.value

        })

    });


    input.value = "";

    loadHabits();

}



// Load habits

async function loadHabits(){

    const list = document.getElementById("habit-list");


    if(!list) return;


    const response = await fetch("/api/habits");

    const habits = await response.json();



    list.innerHTML = "";



    habits.forEach(habit => {


        list.innerHTML += `

        <div class="habit-card ${habit.completed ? "done" : ""}">


            <label class="cute-check">

                <input 
                    type="checkbox"
                    ${habit.completed ? "checked" : ""}
                    onchange="toggleHabit(${habit.id}, this)"
                >

                <span class="checkmark"></span>

            </label>



            <span class="habit-text">

                ${habit.habit}

            </span>



            <button 
                class="delete-task"
                onclick="deleteHabit(${habit.id})">

                🗑️

            </button>


        </div>

        `;


    });


}



// Complete habit

async function toggleHabit(id, checkbox){


    await fetch(`/api/habits/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            completed: checkbox.checked ? 1 : 0

        })

    });


    loadHabits();

}




// Delete habit

async function deleteHabit(id){


    await fetch(`/api/habits/${id}`, {

        method:"DELETE"

    });


    loadHabits();

}




// Load on page open

document.addEventListener("DOMContentLoaded", ()=>{


    if(document.getElementById("habit-list")){

        loadHabits();

    }


});
// ==============================
// 🍅 Focus Timer
// ==============================


let focusTimer = null;

let focusSeconds = 25 * 60;



function updateTimer(){

    let display=document.getElementById("timer");


    if(!display) return;


    let min=Math.floor(focusSeconds/60);

    let sec=focusSeconds%60;


    display.innerText =
    `${min}:${sec<10?"0":""}${sec}`;

}



function startTimer(){

    if(focusTimer) return;


    focusTimer=setInterval(()=>{


        focusSeconds--;


        updateTimer();



        if(focusSeconds<=0){


            clearInterval(focusTimer);

            focusTimer=null;


            completePomodoro();


            alert("Focus complete 🍒✨");


            resetTimer();


        }


    },1000);

}



function pauseTimer(){

    clearInterval(focusTimer);

    focusTimer=null;

}



function resetTimer(){

    clearInterval(focusTimer);

    focusTimer=null;

    focusSeconds=25*60;

    updateTimer();

}



async function completePomodoro(){


    await fetch("/api/pomodoros",{

        method:"POST"

    });


    loadPomodoros();

}




async function loadPomodoros(){


    const count=document.getElementById(
        "pomodoro-count"
    );


    if(!count) return;



    let response=await fetch("/api/pomodoros");


    let data=await response.json();


    count.innerText=data.count;


}



document.addEventListener("DOMContentLoaded",()=>{

    updateTimer();

    loadPomodoros();

});