const now=new Date();
const normalDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const dayOfWeek = now.getDay();  // Returns 0-6 (0 is Sunday, 6 is Saturday)
const dayOfMonth = now.getDate(); // Returns 1-31
const month      = now.getMonth() ; // Returns 1-12 (We add 1 because JS starts at 0)
const year       = now.getFullYear();  // Returns 4-digit year (e.g., 2026)

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



let userData = {};
let user ={};
async function loadUserData() {
    const response = await fetch('http://127.0.0.1:5000/send-user-data');
    const data = await response.json();
    user = data;
    userData = data.personals;
    console.log(`${userData['Height']}cm`);
}


// loadUserData();
function renderPage(){
  if(Object.keys(userData).length !== 0)
  {document.querySelector("#HEIGHT").innerText = `${userData['Height']} cm`;
  document.querySelector("#WEIGHT").innerText = `${userData['Weight']} Kg`;
  document.querySelector("#AGE").innerText = `${userData['Age']} yrs`;
  document.querySelector("#NATIONALITY").innerText = `${userData['Nationality']}`;}
  if(Object.keys(user.parameters).length !== 0 && ( Object.keys(user.parameters).includes("todayTasks"))){
    document.querySelector("#PLAN").innerText = "Active";
    document.querySelector("#Activate-button").style.display = "none";


  }else{
    document.querySelector("#PLAN").innerText = "Inactive";
    document.querySelector("#Activate-button").style.display = "block";
    const secondChild = document.querySelectorAll(".boxes :nth-child(2)");
    secondChild.forEach((val)=>{
      val.innerText = "-";
    })
  }
}

// renderPage();









const cover = document.querySelector('#update-form-background');
const trigger = document.querySelector('.complete-profile'); 
const closeBtn = document.querySelector('#close-form');
const updateBtn = document.querySelector(".submit-btn");
const Form = document.querySelector("#user-data-form");

trigger.addEventListener('click', () => {
    cover.style.display = 'flex'; 
});

closeBtn.addEventListener('click', () => {
    cover.style.display = 'none';
});

async function storeData(data){
  try{
  const response = await fetch('http://127.0.0.1:5000/store-user-profile-parameters' , {
    method : "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(
        data 
    )
    
  })
  if(response.ok){
    return true;
  }else{
    return false;
  }
  ;}
  catch(err){
    console.error("Error in storeData : " , err);
    return false;
  }
}

updateBtn.addEventListener('click' , (e)=>{
  if(!Form.checkValidity()){
    return;
  }
  e.preventDefault();
  const data = {
    Height  : `${document.querySelector("#input-height").value}`,
    Weight  : `${document.querySelector("#input-weight").value}`,
    Age  : `${document.querySelector("#input-age").value}`,
    Nationality  : `${document.querySelector("#input-nationality").value}`,
  }
  let storeDataStatus = storeData(data);
  closeBtn.click();
  if(storeDataStatus){
    window.location.reload();
  }else{
    alert("Some Error Occured");
  }
})



let userStats = {};


async function init() {
    await loadUserData(); 
    renderPage();         
    userStats = {
        weight: userData['Weight'],
        height: userData['Height'],
        age: userData['Age'],
        nationality: userData['Nationality'],
        period: "7 days",
        start: normalDate,
    };
    document.querySelector("#status-profile").innerHTML = `status : <span>${Object.keys(userData).length !== 0 ? "complete" : "incomplete"}</span>`;
}

init();


async function getFitnessPlan(userStats) {
const API_KEY = ""; 
const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const requestBody = {
  systemInstruction: {
    parts: [{ 
      text: `You are an elite fitness and lifestyle coach. 
      Your goal is to provide a daily task schedule to help users become physically and professionally superior to the average person. 
      You MUST respond ONLY with a JSON object following the exact schema provided by the user. 
      Respond ONLY with JSON in this exact structure:
    {
  "todayTasks": {
    "Apr 17": {
      "tasks": {
        "Health": { "completed": 0, "total": 3, "subtask": { "TaskName": false } },
        "Career": { "completed": 0, "total": 3, "subtask": { "TaskName": false } },
        "Personal": { "completed": 0, "total": 3, "subtask": { "TaskName": false } },
        "Meal" : {"completed": 0, "total": 3, "subtask": { "Breakfast": false  , "Lunch" : "false" , "Dinner" : "false"}}
      },
      "meal": {
        "week1": {
          "monday": [
            { "type": "Breakfast", "food": "6 Egg Whites + Oats", "protein": "30g", "cals": "400" },
            { "type": "Lunch", "food": "Chicken Breast + Brown Rice", "protein": "45g", "cals": "600" },
            { "type": "Dinner", "food": "Paneer + Broccoli", "protein": "25g", "cals": "450" }
          ],
          "tuesday": [
            { "type": "Breakfast", "food": "Greek Yogurt + Berries", "protein": "20g", "cals": "300" },
            { "type": "Lunch", "food": "Tuna Salad + Whole Wheat Bread", "protein": "35g", "cals": "500" }
          ]
        }
      },
      "workout": {
        "exercises": [
          { "name": "Pushups", "sets": 3, "reps": 12, "done": false },
          { "name" : ""}
        ]
      }
    }
  }
}
        and so on . Here the task categories and tasks can be anything that are inline with the development of the user.
        the keys of "todayTasks" elements would start from the start date and would extend until the period of time 
        the user has provided.Remember to always add the Meal in tasks.
      Ensure tasks under 'Health' are scientifically calibrated for the user's height, weight, and age.` 
    }]
  },

  contents: [{
    parts: [{ 
      text: `Generate a task list for a ${userStats.age}-year-old from ${userStats.nationality}, 
      height ${userStats.height}, weight ${userStats.weight}, for a period of ${userStats.period}. 
      Starting date: ${userStats.start}.` 
    }]
  }],

  generationConfig: {
    temperature: 0.4, 
    responseMimeType: "application/json"
  }
};
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    const planString = data.candidates[0].content.parts[0].text;
    const planJson = JSON.parse(planString);
    try {
        const res = await fetch("http://127.0.0.1:5000/trial-ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                planJson
            )
        });

        const Data = await res.json();
        console.log(Data);

    } catch (err) {
        console.error("Error:", err);
    }
    

    // console.log(planJson.todayTasks["Apr 4"].Health);
    console.log("Done HERE");
    console.log( "HELLO WORLD", planString); 
    return true;
  } catch (error) {
    console.error("Failed to generate plan:", error);
    return false;
  }
}

async function AI(){
  if(document.querySelector("#status-profile span").innerText === "complete"){
    userStats.period  = `${document.querySelector("#days").value} days`;
    console.log(userStats , "Bro running");
    const statusOfMax = await getFitnessPlan(userStats);
    if(statusOfMax){
      confirm("You are all set");
      window.location.reload();
    }
  }else{
    confirm("Complete profile first");
  }
}