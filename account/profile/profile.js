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







const API_KEY = "API_KEY"; 
const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const userStats = {
  weight: "75kg",
  height: "180cm",
  age: 22,
  nationality: "Indian",
  period: "2 days",
  start : normalDate,
};

const requestBody = {
  // 1. Tell the model WHO it is and HOW to respond
  systemInstruction: {
    parts: [{ 
      text: `You are an elite fitness and lifestyle coach. 
      Your goal is to provide a daily task schedule to help users become physically and professionally superior to the average person. 
      You MUST respond ONLY with a JSON object following the exact schema provided by the user. 
      Respond ONLY with JSON in this exact structure:
      {
        "todayTasks": {
          "${userStats.start}": {
            "Health": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } },
            "Career": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } },
            "Personal": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } },
            "My Thing": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } }
          },
        "Apr 13": {
            "Some Task category": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } },
            "Some Other task category": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } },
            "Some task category": { "completed": 0, "total": 3, "subtask": { "TaskName": "false" } }
          }
        }
    }
        and so on . Here the task categories and tasks can be anything that are inline with the development of the user.
        the keys of "todayTasks" elements would start from the start date and woul extend until the period of time 
        the user has provided.
      Ensure tasks under 'Health' are scientifically calibrated for the user's height, weight, and age.` 
    }]
  },

  // 2. Provide the user's specific data
  contents: [{
    parts: [{ 
      text: `Generate a task list for a ${userStats.age}-year-old from ${userStats.nationality}, 
      height ${userStats.height}, weight ${userStats.weight}, for a period of ${userStats.period}. 
      Starting date: ${userStats.start}.` 
    }]
  }],

  // 3. Force JSON output
  generationConfig: {
    temperature: 0.4, // Lower temperature for more consistent formatting
    responseMimeType: "application/json"
  }
};

async function getFitnessPlan() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    // The model returns a string of JSON inside the parts
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
  } catch (error) {
    console.error("Failed to generate plan:", error);
  }
}





const cover = document.querySelector('#update-form-background');
const trigger = document.querySelector('.complete-profile'); 
const closeBtn = document.querySelector('#close-form');
const updateBtn = document.querySelector(".submit-btn");

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