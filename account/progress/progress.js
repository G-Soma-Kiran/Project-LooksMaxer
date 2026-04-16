//New Start
const now=new Date();
const normalDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const dayOfWeek = now.getDay();  // Returns 0-6 (0 is Sunday, 6 is Saturday)
const dayOfMonth = now.getDate(); // Returns 1-31
const month      = now.getMonth() ; // Returns 1-12 (We add 1 because JS starts at 0)
const year       = now.getFullYear();  // Returns 4-digit year (e.g., 2026)
function getPreviousDate(dateStr) {
    const d = new Date(dateStr + " " + year);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
let todaysProgress=0
let totalOfToday=0;

let flipState=false;
let parameters = {}

// console.log(JSON.stringify(parameters));
async function loadUserData() {
    const response = await fetch('http://127.0.0.1:5000/send-user-data');
    const data = await response.json();
    parameters = data['parameters'];
    console.log(parameters);
}
async function init() {
    // console.log("loading...");
    // await getFitnessPlan();
    await loadUserData(); 
    if(!(Object.keys(parameters).length !== 0 && ( Object.keys(parameters).includes("todayTasks")))){
        confirm("Please start a plan first... Redirecting to profile page");
        window.location.href='/profile/profile.html';
    }
    Object.values(parameters.todayTasks[`${normalDate}`]).forEach(category => {
        totalOfToday += Object.keys(category.subtask).length;
    });
    if(normalDate in parameters.dailyTotal)
    {
        renderProgress();
    }
    else{
        if(getPreviousDate(normalDate) in parameters.dailyTotal  && parameters.dailyTotal[`${getPreviousDate(normalDate)}`][0] > 0){
            parameters.streak+=1;
        }else{
            parameters.streak=0;
        }
        await storeData();
        renderProgress();
    }
}

function createDailyTask(){
const progress__Box = document.querySelector("#progress_box");
const todayTasksKeys = Object.keys(parameters.todayTasks[`${normalDate}`]);
todayTasksKeys.forEach((val , index)=>{

    let useNthrow = document.createElement('div');
    useNthrow.innerHTML ="";
    const category = parameters.todayTasks[`${normalDate}`][val]; 
    const subtaskObj = category.subtask;
    const subtaskKeys = Object.keys(subtaskObj);
    subtaskKeys.forEach((value)=>{
    useNthrow.innerHTML +=
        `
        <div class="task-item">
            <label onclick="event.stopPropagation()">
                <input type="checkbox" onchange="updateProgress(this)" data-clicked="${subtaskObj[value]}">
                <span>${value}</span>
            </label>
        </div>

        `
    })

    progress__Box.innerHTML += 
    
    `
    <div class="inner_progress_box" onclick="toggleCard(this)">
        <div class="card-header">
            <div class="card-info">
                <span class="card-title">${val}</span>
                <span class="card-status" id="workout-status">${category.completed}/${category.total} Completed</span>
            </div>
                 <span class="chevron">▼</span>
            </div>
                    
            <div class="display_hidden" data-number="${index+1}">
               ${useNthrow.innerHTML}
            </div>
    </div>

    `

})
    
}

function validateDailyTask(){
    const allCheckboxes=document.querySelectorAll(".task-item input");
    allCheckboxes.forEach((val)=>{
        if(val.getAttribute("data-clicked") === "true"){
            val.checked = true;
            updateProgress(val , true);
        }
    })
}

function createHeatMap(){
    let allDates = Object.keys(parameters.dailyTotal);
    allDates.forEach((val)=>{
        let number = parameters.dailyTotal[`${val}`][0];
        let total = parameters.dailyTotal[`${val}`][1];
        heatMap(number , total , val);
    })
    
}
//Dependencies => todaysProgress , totalOfToday




// navbar change 
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
// navbar change end



//Display_hidden Toggle function
function toggleCard(target) {  //this reference of the whole inner_progress_box is sent to function. 
    const hiddenDiv = target.querySelector(".display_hidden");
    const chevron = target.querySelector(".chevron");
    if (hiddenDiv.style.display === "flex") {
        hiddenDiv.style.display = "none";
        if(chevron) chevron.style.transform = "rotate(0deg)";
    } else {
        hiddenDiv.style.display = "flex";
        if(chevron) chevron.style.transform = "rotate(180deg)";
    }
}
//Display_hidden Toggle function end




//Heat map
function getGridElement(row, col) {
    const totalCols = 7;  // weeks
    const index = row * totalCols + col;
    const grid = document.querySelector('.inner-stat-card2');
    return grid.children[index];
}



let firstDayDay = new Date(year, month, 1).getDay();
let daysInMonth = new Date(year, month+1, 0).getDate();
function gridMaker()
{for(let i=0;i<6;i++){
    for(let j=0;j<7;j++){
        let clear = getGridElement(i , j);
        if(i*7 + j - firstDayDay>=0 && i*7 + j - firstDayDay<=daysInMonth-1 ){
            clear.setAttribute("data-dateNumber" , `${i*7 + j + 1-firstDayDay}` );
            clear.setAttribute("data-normalDate" , `${new Date(year, month, i*7+j - firstDayDay+1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
            continue;
        }else{
            clear.style.visibility="hidden";
            clear.setAttribute("data-dateNumber" , "-1");
        }
    }
}}


function heatMap(number , total , date=normalDate){
    let TodaysHeatMapCell = document.querySelector('.inner-stat-card2').querySelector(`[data-normalDate="${date}"]`);
    TodaysHeatMapCell.setAttribute("title", `${number}/${total}`);
    let value = Math.round(number*100/total);
    const ratio = value/100; 
    const dynamicColor = `hsl(145, ${41 + (ratio * 40)}%, ${70 - (ratio * 25)}%)`;
    TodaysHeatMapCell.style.backgroundColor = dynamicColor;
    if(number === 0){
        TodaysHeatMapCell.style.backgroundColor = "rgb(159, 160, 157)";
    }

}
//Heat map end



//Daily Task Bar Graph Update
function updateBarGraph( todaysProgress ,totalOfToday){
    const lastBar = document.querySelector(".bar_graph").lastChild.querySelector(".bar-fill");
    const percentage=Math.round(Math.min((todaysProgress / totalOfToday) * 100, 100));
    lastBar.parentElement.setAttribute("data-percentage" , `${percentage}%`);
    if(lastBar.parentElement.getAttribute("data-view") === "percent"){
        lastBar.querySelector(".bar-label").innerText=lastBar.parentElement.getAttribute("data-percentage");
    }
    requestAnimationFrame(() => {
        lastBar.style.height=`${percentage}%`;
    });
}

function updateTaskGraph(checkbox ){
    const parentCard = checkbox.closest(".display_hidden");
    const cardNumber = parentCard.dataset.number;
    const barGraph = document.querySelector(".bar_graph");
    const reqBar=barGraph.querySelector(`[data-number="${cardNumber}"]`).querySelector(".bar-fill");
    const total = parentCard.querySelectorAll('input[type="checkbox"]').length;
    const checkedCount = parentCard.querySelectorAll('input[type="checkbox"]:checked').length;
    console.log(checkedCount , total);
    const percentage = Math.round(Math.min((checkedCount / total) * 100, 100));
    reqBar.parentElement.setAttribute("data-percentage" , `${percentage}%`);
    if(reqBar.parentElement.getAttribute("data-view") === "percent"){
        reqBar.querySelector(".bar-label").innerText=reqBar.parentElement.getAttribute("data-percentage");
    }
    requestAnimationFrame(() => {
        reqBar.style.height = `${percentage}%`;
    });

}
async function updateProgress(checkbox , loadingAtStart=false) {
    const card = checkbox.closest('.inner_progress_box');
    const statusLabel = card.querySelector(".card-status");
    
    if (checkbox.checked) {
        checkbox.parentElement.style.textDecoration = "line-through";
        checkbox.parentElement.style.color = "#b2bec3";
        checkbox.setAttribute("data-clicked" , "true");
        if(!loadingAtStart)
        {parameters.todayTasks[`${normalDate}`][`${card.querySelector(".card-title").innerText}`].completed+=1;}
        todaysProgress+=1;
    } else {
        checkbox.parentElement.style.textDecoration = "none";
        checkbox.parentElement.style.color = "inherit";
        checkbox.setAttribute("data-clicked" , "false");
        if(!loadingAtStart)
        {parameters.todayTasks[`${normalDate}`][`${card.querySelector(".card-title").innerText}`].completed-=1;}
        todaysProgress-=1;
    }
    parameters.todayTasks[`${normalDate}`][`${card.querySelector(".card-title").innerText}`].subtask[`${checkbox.parentElement.querySelector("span").innerText}`] =`${checkbox.getAttribute("data-clicked")}`;

    document.getElementById("todays-progress").innerText = `${Math.round(todaysProgress*100/totalOfToday)}%`;
    const total = card.querySelectorAll('input[type="checkbox"]').length;
    const checkedCount = card.querySelectorAll('input[type="checkbox"]:checked').length;
    if (statusLabel) {
        statusLabel.innerText = `${checkedCount}/${total} Completed`;
        statusLabel.style.color = (checkedCount === total) ? "#2ecc71" : "#636e72";
    }

    const ratio = checkedCount / total; 
    const dynamicColor = `hsl(145, ${ratio * 80}%, ${90 - (ratio * 45)}%)`;

    card.style.borderLeftColor = dynamicColor;
    
    heatMap( todaysProgress , totalOfToday);

    if(flipState === false)
    {
        updateBarGraph(todaysProgress , totalOfToday);
    }else{
        updateTaskGraph(checkbox);
    }
    if(!loadingAtStart){
        await storeData();
    }
    document.querySelector("#streak").innerText=`${parameters.streak + (parameters.dailyTotal[`${normalDate}`][0] > 0? 1 : 0)} Days 🔥`;

}
//Daily Task Bar Graph Update end




function createBar(a , b , text , rollNum=-1){
    const barContainer = document.createElement('div');
    barContainer.style.width = "100px";
    barContainer.style.flexShrink = "0";
    barContainer.style.backgroundColor = "#a0a0a0"; 
    barContainer.style.borderRadius = "8px 8px 8px 8px";
    barContainer.style.height = "100%"; 
    barContainer.style.display = "flex";
    barContainer.style.flexDirection = "column";
    barContainer.style.justifyContent = "flex-end";
    barContainer.classList.add('pointer');
    barContainer.setAttribute("data-number" , `${rollNum}`);
    barContainer.setAttribute("data-view", "date");
    const fill = document.createElement('div');
    const percentage = Math.round(Math.min((a / b) * 100, 100));
    barContainer.setAttribute("data-percentage" , `${percentage}%`);
    barContainer.addEventListener('click' , ()=>{
    const label = barContainer.querySelector(".bar-label");
    const currentPercent = barContainer.getAttribute("data-percentage");
    const currentView = barContainer.getAttribute("data-view"); 

    if (label.classList.contains('label-fade')) return;

    label.classList.add('label-fade');

    setTimeout(() => {
        if (currentView === "date") {
            label.innerText = currentPercent;
            barContainer.setAttribute("data-view", "percent");
        } else {
            label.innerText = text;
            barContainer.setAttribute("data-view", "date");
        }

        label.classList.remove('label-fade');
    }, 200);
    })
    
    fill.style.height = `${percentage}%`;
    fill.style.width = "100%";
    fill.style.backgroundColor = "var(--accent)"; 
    fill.style.borderRadius = "8px 8px 8px 8px";
    fill.style.height = "0%"; 
    fill.style.transition = "height 0.8s ease-in-out";
    fill.style.display="flex";
    fill.style.alignItems="flex-start";
    fill.style.justifyContent="center";
    fill.classList.add("bar-fill");
    const label = document.createElement('div');
    label.className = "bar-label";
    label.innerText = text;


    requestAnimationFrame(() => {
        const percentage = Math.round(Math.min((a / b) * 100, 100));
        fill.style.height = `${percentage}%`;
    });

    barContainer.appendChild(fill);
    fill.append(label);
    return barContainer;
}

function addBar(number=0 , total=0 , date=0){
    // flipState= !flipState;
    const barGraph = document.querySelector(".bar_graph");
    // barGraph.innerHTML="";
    barGraph.append(createBar(number, total , date));
    document.querySelector(".bar_graph").scrollTo({left: barGraph.scrollWidth, behavior: 'smooth'});
}

function taskGraph(){
    // flipState= !flipState;
    let everyProgress = document.querySelectorAll(".inner_progress_box");
    const barGraph = document.querySelector(".bar_graph");
    // barGraph.innerHTML="";
    
everyProgress.forEach(
    (val , index)=>{
        setTimeout(()=>{const totalTasks = val.querySelectorAll('input[type="checkbox"]').length;
    const doneTasks = val.querySelectorAll('input[type="checkbox"]:checked').length;
    barGraph.append(createBar(doneTasks, totalTasks , val.querySelector(".card-title").innerText ,index+1));
    document.querySelector(".bar_graph").scrollTo({left: barGraph.scrollWidth, behavior: 'smooth'});},50*index);
    
    }
)
}

function makeGraph(graph){
    const barGraph = document.querySelector(".bar_graph");
    barGraph.innerHTML="";
    if(flipState === false){
        taskGraph();
        document.getElementById(graph).innerText="Today's Task Graph";
    }else{
        let allDates = Object.keys(parameters.dailyTotal).sort((a, b) => {
    return new Date(a + " 2026") - new Date(b + " 2026");
});
        allDates.forEach((val)=>{
            let number = parameters.dailyTotal[`${val}`][0];
            let total = parameters.dailyTotal[`${val}`][1];
            console.log(number , total , val);
            addBar(number , total , val);
        })
        document.getElementById(graph).innerText="Daily Activity Graph";
    }
    flipState= !flipState;
}

async function storeData(){
    parameters.dailyTotal[`${normalDate}`] = [0 , 0];
    parameters.dailyTotal[`${normalDate}`][0] = todaysProgress;
    parameters.dailyTotal[`${normalDate}`][1] = totalOfToday;
    console.log(parameters.dailyTotal);
    console.log(normalDate);
    try {
        const res = await fetch("http://127.0.0.1:5000/store-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                parameters 
            )
        });

        const data = await res.json();
        console.log(data);

    } catch (err) {
        console.error("Error:", err);
    }
}









//End of New Start


function renderProgress(){
//     Object.values(parameters.todayTasks[`${normalDate}`]).forEach(category => {
//     totalOfToday += Object.keys(category.subtask).length;
// });
    gridMaker();
    let allDates = Object.keys(parameters.dailyTotal).sort((a, b) => {
    return new Date(a + " 2026") - new Date(b + " 2026");
});
    allDates.forEach((val)=>{
        let number = parameters.dailyTotal[`${val}`][0];
        let total = parameters.dailyTotal[`${val}`][1];
        addBar(number , total , val);
    })
    // addBar();  
    createDailyTask();
    validateDailyTask();
    createHeatMap();
    document.querySelector("#streak").innerText=`${parameters.streak + (parameters.dailyTotal[`${normalDate}`][0] > 0? 1 : 0)} Days 🔥`;
    // getFitnessPlan();

}
init();