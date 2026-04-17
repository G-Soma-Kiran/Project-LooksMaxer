const now=new Date();
const normalDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const dayOfWeek = now.getDay();  // Returns 0-6 (0 is Sunday, 6 is Saturday)
const dayOfMonth = now.getDate(); // Returns 1-31
const month      = now.getMonth() ; // Returns 1-12 (We add 1 because JS starts at 0)
const year       = now.getFullYear();  // Returns 4-digit year (e.g., 2026)


const btn = document.getElementById("toggleBtn");
const navbar = document.getElementById("left_navbar");

btn.onclick = () => {
    navbar.classList.toggle("collapsed");

    if (navbar.classList.contains("collapsed")) {
        document.querySelectorAll('.navbar2').forEach(item => {
            const icon = item.querySelector('.icon');
            const iconWidth = icon.getBoundingClientRect().width;
            const targetPadding = (70 - iconWidth) / 2;
            item.style.paddingLeft = `${targetPadding}px`;
        });
        btn.innerHTML = "&#9776;"; 

    } else {
        document.querySelectorAll('.navbar2').forEach(item => {
            item.style.paddingLeft = "15px";
        });
        btn.innerHTML = "✖"; 
    }
};
navbar.addEventListener('animationend', () => {
    setTimeout(()=>{navbar.classList.remove("animate_left_navbar");navbar.classList.add("normal_left_navbar");},900);
    
}, { once: true });


let workouts ={};
async function loadUserData() {
    const response = await fetch('http://127.0.0.1:5000/send-user-data');
    const data = await response.json();
    workouts = data.parameters.todayTasks[`${normalDate}`].workout.exercises;
    console.log(workouts);
}

const table_body = document.querySelector("#exercise-body");
function loadTable() {
    const table_body = document.querySelector("#exercise-body");
    table_body.innerHTML = ""; // Clear loader/previous data

    workouts.forEach((val, index) => {
        // Create a proper row element to apply class
        const row = document.createElement('tr');
        row.className = 'exercise-row';
        
        row.innerHTML = `
            <td class="status-cell">
                <input type="checkbox" ${val.done ? 'checked' : ''} onchange="updateStatus(${index})">
            </td>
            <td>${val.name}</td>
            <td>${val.reps}</td>
            <td>${val.sets} Sets</td>
        `;
        
        table_body.appendChild(row);
    });
}

// Simple handler for status changes
function updateStatus(index) {
    workouts[index].done = !workouts[index].done;
    console.log(`${workouts[index].name} is now ${workouts[index].done ? 'Completed' : 'Pending'}`);
}

async function init(){
    await loadUserData();
    loadTable();
}

init();



