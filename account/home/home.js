// const meal_plan = {
//     week1:{
//         monday : "chicken + rice",
//         tuesday : "Eggs + bread"
//     },
//     week2:{
//         monday :"maakichu",
//         tuesday  : "Pikachu"
//     }

// }
let meal_plan = {
    week1: {
        monday: [
            { type: "Breakfast", food: "6 Egg Whites + Oats", protein: "30g", cals: "400" },
            { type: "Lunch", food: "Chicken Breast + Brown Rice", protein: "45g", cals: "600" },
            { type: "Dinner", food: "Paneer + Broccoli", protein: "25g", cals: "450" }
        ],
        tuesday: [
            { type: "Breakfast", food: "Greek Yogurt + Berries", protein: "20g", cals: "300" },
            { type: "Lunch", food: "Tuna Salad + Whole Wheat Bread", protein: "35g", cals: "500" }
        ]
    },
};
let user = {};

async function loadUserData() {
    const response = await fetch('http://127.0.0.1:5000/send-user-data');
    const data = await response.json();

    meal_plan = data['parameters']['todayTasks']['meal'];
    console.log( data['parameters']['todayTasks']['meal']);
}

let activatedWeek;
let activatedDay;
function changeColor(btn){
    document.querySelectorAll(".td_button").forEach(b =>{ b.classList.remove("active") ;
        
        b.parentElement.style.border ="none";});
        
    const no_bottom_border = document.querySelectorAll(".no_bottom_border");
    no_bottom_border.forEach((val) => {val.style.borderBottom = "none";});

    btn.classList.add("active");
    btn.parentElement.style.borderBottom = "4px solid #d4af37";
    
    activatedWeek=btn.id;
    renderMeals();
    if(activatedDay == undefined){
        return
    }
    // document.getElementById("meal_content").innerText = meal_plan[activatedWeek][activatedDay];
}

function changeColour(btn){
    document.querySelectorAll(".td2_button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activatedDay = btn.id
    renderMeals();
    if(activatedWeek == undefined){
        return
    }
    // document.getElementById("meal_content").innerText = meal_plan[activatedWeek][activatedDay];
}

let currentStart = 1;
const totalWeeks = 20;

function renderWeeks(){
    const row = document.getElementById("weekRow");
    row.innerHTML = ""; 

    for(let i = currentStart; i < currentStart + 6; i++){
        if(i > totalWeeks) break;

        row.innerHTML += `
            <td class="border_yes">
                <button class="td_button" id="week${i}" onclick="changeColor(this)">Week 0${i}</button>
            </td>
        `;
    }


    row.innerHTML += `
        <td class="border_yes">
             <ul>
                 <li class="no_bottom_border" ><button class="td_button td_list_button" onclick="nextBlock()">next➡</button></li>
                 <li class="no_bottom_border" ><button class="td_button td_list_button" onclick="prevBlock()">⬅prev</button></li>
             </ul>
        </td>
    `;
}

function nextBlock(){
    currentStart += 6;

    if(currentStart > totalWeeks){
        currentStart = 1; 
    }

    renderWeeks();
}

function prevBlock(){
    currentStart-=6;
    if(currentStart <= 0){
        currentStart = 1;
    }
    renderWeeks();
}

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



// circle bmi 
const radius = 50;
const circumference = 2 * Math.PI * radius;

function setProgress(percent, circle, textEl) {
    circle.style.strokeDasharray = circumference;

    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    textEl.innerText = percent ;
    
}
function animateProgress(target, circle, textEl) {
    let percent = 0;

    let interval = setInterval(() => {
        if (percent > target) {
            clearInterval(interval);
            return;
        }

        setProgress(percent, circle, textEl);
        percent++;
    }, 10);
}
// setProgress(57 , document.getElementById("bmiProgressCircle") , document.getElementById("bmiPercentText"));
animateProgress(57 , document.getElementById("bmiProgressCircle") , document.getElementById("bmiPercentText"));
animateProgress(20 , document.getElementById("calorieProgressCircle") , document.getElementById("caloriePercentText"));
animateProgress(10 , document.getElementById("protienProgressCircle") , document.getElementById("protienPercentText"));
animateProgress(80 , document.getElementById("somethingProgressCircle") , document.getElementById("somethingPercentText"));

//circle bmi end


userPersonals = {}
async function loadUserData() {
    const response = await fetch('http://127.0.0.1:5000/send-user-data');
    const data = await response.json();
    user = data;
    userPersonals = data.personals;
}
// animateProgress(userPersonals["Weight"] * 1.4 , document.getElementById("protienProgressCircle") , document.getElementById("protienPercentText"));

function renderMeals() {
    const displayArea = document.getElementById("meal_content");
    displayArea.innerHTML = ""; 

    if (activatedWeek && activatedDay && meal_plan[activatedWeek][activatedDay]) {
        const meals = meal_plan[activatedWeek][activatedDay];
        console.log(meals);
        meals.forEach(meal => {
            const card = `
            <a href="https://www.swiggy.com/search?query=${meal.food}" target = "_blank" style = "text-decoration : none; color : white;">
                <div class="meal-card">
                    <h3>${meal.type}</h3>
                    <div class="food-items">${meal.food}</div>
                    <div class="macros">🔥 ${meal.cals} kcal | 💪 ${meal.protein} protein</div>
                </div>
            </a>
            `;
            displayArea.innerHTML += card;
        });
    } else {
        displayArea.innerHTML = "<p style='color: #666;'>Select a week and day to view your plan.</p>";
    }
}


async function init(){
    await loadUserData();
    let parameters = user.parameters;
    console.log((Object.keys(parameters).length !== 0 && ( Object.keys(parameters).includes("todayTasks"))));
    if(!(Object.keys(parameters).length !== 0 && ( Object.keys(parameters).includes("todayTasks")))){
        confirm("Please start a plan first... Redirecting to profile page");
        window.location.href='/profile/profile.html';
    }
}

init();