const meal_plan = {
    week1:{
        monday : "chicken + rice",
        tuesday : "Eggs + bread"
    },
    week2:{
        monday :"maakichu",
        tuesday  : "Pikachu"
    }

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
    if(activatedDay == undefined){
        return
    }
    document.getElementById("meal_content").innerText = meal_plan[activatedWeek][activatedDay];
}

function changeColour(btn){
    document.querySelectorAll(".td2_button")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activatedDay = btn.id
    if(activatedWeek == undefined){
        return
    }
    document.getElementById("meal_content").innerText = meal_plan[activatedWeek][activatedDay];
}

let currentStart = 1;
const totalWeeks = 20;

function renderWeeks(){
    const row = document.getElementById("weekRow");
    row.innerHTML = ""; // clear old weeks

    // show 6 weeks
    for(let i = currentStart; i < currentStart + 6; i++){
        if(i > totalWeeks) break;

        row.innerHTML += `
            <td class="border_yes">
                <button class="td_button" id="week${i}" onclick="changeColor(this)">Week 0${i}</button>
            </td>
        `;
    }

    // add ➡ button
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
        currentStart = 1; // restart (optional)
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

