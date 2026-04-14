const now=new Date();
const normalDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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



//display none thingy
// function showDiv(target){
//     const allDisplayHiddens=document.querySelectorAll(".display_hidden");
//     const stl = target.querySelector(".display_hidden").style.display;
//     allDisplayHiddens.forEach((val) => {val.style.display = "none" ; });
//     if( stl == "none"){
//         target.querySelector(".display_hidden").style.display = "flex";
//     }else if(stl == "flex"){
//         target.querySelector(".display_hidden").style.display = "none";
//     }
// }




// shit

function toggleCard(target) {
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


function getGridElement(row, col) {
    const totalCols = 6;  // weeks
    const index = row * totalCols + col;
    const grid = document.querySelector('.inner-stat-card2');
    return grid.children[index];
}

function heatMap(value , number , total){
    const here=new Date();
    const day = here.getDate();
    console.log(day);
    let waste=1;
    for(let i=0;i<7;i++){
        for(let j =0 ;j<6;j++){
            let waste2=getGridElement(i  , j);
            if(waste == day){
                waste2.setAttribute("title", `${number}/${total}`);

                // if(value <=10){
                //     waste2.style.backgroundColor="#dfe6e9";
                // }else if( value <=50 ){
                //     waste2.style.backgroundColor="#7e9e8b";
                // }else if(value  < 100){
                //     waste2.style.backgroundColor="#9ed7b6";
                // }else{
                //     waste2.style.backgroundColor="#2ecc71";
                // }
                const ratio = value/100; 
                const dynamicColor = `hsl(145, ${41 + (ratio * 40)}%, ${70 - (ratio * 25)}%)`;

                waste2.style.backgroundColor = dynamicColor;
                return;
            }else{
                if(waste2.style.visibility != "hidden")
                    waste+=1;
            }
        }
    }

}

let flipState=false;
function updateBarGraph(todaysProgress , totalOfToday){
    const lastBar = document.querySelector(".bar_graph").lastChild.querySelector(".bar-fill");
    console.log(lastBar);
    const percentage=Math.round(Math.min((todaysProgress / totalOfToday) * 100, 100));
    lastBar.parentElement.setAttribute("data-percentage" , `${percentage}%`);
    if(lastBar.parentElement.getAttribute("data-view") === "percent"){
        lastBar.querySelector(".bar-label").innerText=lastBar.parentElement.getAttribute("data-percentage");
    }
    requestAnimationFrame(() => {
        lastBar.style.height=`${percentage}%`;
    });
}

function updateTaskGraph(checkbox){
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
let todaysProgress = 0;
let totalOfToday = document.querySelectorAll(".task-item").length;
function updateProgress(checkbox) {
    const card = checkbox.closest('.inner_progress_box');
    const statusLabel = card.querySelector(".card-status");
    
    if (checkbox.checked) {
        checkbox.parentElement.style.textDecoration = "line-through";
        checkbox.parentElement.style.color = "#b2bec3";
        todaysProgress+=1;
    } else {
        checkbox.parentElement.style.textDecoration = "none";
        checkbox.parentElement.style.color = "inherit";
        todaysProgress-=1;
    }
    document.getElementById("todays-progress").innerText = `${Math.round(todaysProgress*100/totalOfToday)}%`;
    const total = card.querySelectorAll('input[type="checkbox"]').length;
    const checkedCount = card.querySelectorAll('input[type="checkbox"]:checked').length;
    if (statusLabel) {
        statusLabel.innerText = `${checkedCount}/${total} Completed`;
        statusLabel.style.color = (checkedCount === total) ? "#2ecc71" : "#636e72";
    }

    // if(checkedCount/total <=0.1){
    //     card.style.borderLeftColor = "#dfe6e9";
    // }else if( checkedCount/total  <=0.5 ){
    //     card.style.borderLeftColor = "#7e9e8b";
    // }else if(checkedCount/total  < 1){
    //     card.style.borderLeftColor = "#9ed7b6";
    // }else{
    //     card.style.borderLeftColor = "#2ecc71";
    // }
    const ratio = checkedCount / total; 
    const dynamicColor = `hsl(145, ${ratio * 80}%, ${90 - (ratio * 45)}%)`;

    card.style.borderLeftColor = dynamicColor;
    
    heatMap(Math.round(todaysProgress*100/totalOfToday) , todaysProgress , totalOfToday);

    if(flipState === true)
    {
        updateBarGraph(todaysProgress , totalOfToday);
    }else{
        updateTaskGraph(checkbox);
    }

}







const dayOfWeek = now.getDay();  // Returns 0-6 (0 is Sunday, 6 is Saturday)
const dayOfMonth = now.getDate(); // Returns 1-31
const month      = now.getMonth() ; // Returns 1-12 (We add 1 because JS starts at 0)
const year       = now.getFullYear();  // Returns 4-digit year (e.g., 2026)

let firstDayDate = new Date(year, month, 1);
let t = 0; 
let T=firstDayDate.getDay();
let daysInMonth = new Date(year, month+1, 0).getDate();
for(let i = 0 ; i< 7; i++ ){
    for(let j=0;j< 6;j++){
        if(j == T){
            T=-1;
        }
        if(t == daysInMonth){
            T=69; //Some random value so that T never equals j again
        }
        if(T != -1){
            let clear = getGridElement(i , j);
            clear.style.visibility="hidden";
        }else{
            t+=1;
        }
        // clear.innerText=`${i} , ${j}`;
    }
    
}


// const normalDate = now.toISOString().split('T')[0];
// function createBar(){
//     const bar = document.createElement('div');
//     bar.style.height =`${0.5*Math.round(todaysProgress*100/totalOfToday)}vh`;
//     bar.style.width = "100px";
//     bar.style.backgroundColor = "blue";
//     bar.style.flexShrink="0";
//     bar.append(document.createElement('p').innerText=`${normalDate}`);
//     return bar;
// }


// function addBar(){
//     const emptyBar = document.createElement('div');
//     emptyBar.style.height = "50vh";
//     emptyBar.style.width="100px";
//     emptyBar.style.visibility = "hidden";
//     emptyBar.style.flexShrink="0";
//     const barGraph = document.querySelector(".bar_graph");
//     barGraph.append(emptyBar);
//     barGraph.append(createBar());
// }





function createBar(a , b , text , rollNum){
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
        // if(barContainer.lastChild.lastChild.innerText == text){
        //     barContainer.lastChild.lastChild.innerText = barContainer.getAttribute("data-percentage");
        // }else{
        //     barContainer.lastChild.lastChild.innerText=text;
        // }

        // const currentPercent = barContainer.getAttribute("data-percentage"); 
        // const label = barContainer.querySelector(".bar-label");

        // if (label.innerText === text) {
        //     label.innerText = currentPercent;
        // } else {
        //     label.innerText = text;
        // }
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

function addBar(){
    flipState= !flipState;
    const barGraph = document.querySelector(".bar_graph");
    barGraph.innerHTML="";
    barGraph.append(createBar(todaysProgress, totalOfToday , normalDate));
    // const label = document.createElement('div');
    // label.className = "bar-label";
    // label.innerText = normalDate;
    document.querySelector(".bar_graph").scrollTo({left: barGraph.scrollWidth, behavior: 'smooth'});
}

function taskGraph(){
    flipState= !flipState;
    let everyProgress = document.querySelectorAll(".inner_progress_box");
    const barGraph = document.querySelector(".bar_graph");
    barGraph.innerHTML="";
    
everyProgress.forEach(
    (val , index)=>{
        setTimeout(()=>{const totalTasks = val.querySelectorAll('input[type="checkbox"]').length;
    const doneTasks = val.querySelectorAll('input[type="checkbox"]:checked').length;
    barGraph.append(createBar(doneTasks, totalTasks , val.querySelector(".card-title").innerText ,index+1));
    // const label = document.createElement('div');
    // label.className = "bar-label";
    // label.innerText = val.querySelector(".card-title").innerText;
    document.querySelector(".bar_graph").scrollTo({left: barGraph.scrollWidth, behavior: 'smooth'});},50*index);
    
    }
)
}

function makeGraph(graph){
    if(flipState === true){
        taskGraph();
        document.getElementById(graph).innerText="Today's Task Graph";
    }else{
        addBar();
        document.getElementById(graph).innerText="Daily Activity Graph";
    }
}

addBar();  











































