const show = document.querySelectorAll(".show");
const password = document.querySelectorAll(".pass input");
const statusBox= document.querySelector(".status-box");
const bigBox = document.querySelector(".container");
const inputTakers = document.querySelectorAll(".input-data input");
// show.forEach((val , index)=>{
//     val.addEventListener('click' , ()=>{
//     let slash = document.querySelector(`#slash${index}`);
//     console.log(`#slash${index}`);
//     if(password[index].type === "password"){
//         password[index].type = "text";
//         slash.style.visibility = "visible";
//     }else{
//         password[index].type = "password";
//         slash.style.visibility = "hidden";

//     }
//     });
// });
show.forEach((val) => {
    val.addEventListener('click', () => {
        // 1. Find the container (the .input-data div)
        const parent = val.parentElement;
        
        // 2. Find the input and slash inside THAT specific container
        const inputField = parent.querySelector("input");
        const slashIcon = parent.querySelector("span[id^='slash']");

        if (inputField.type === "password") {
            inputField.type = "text";
            slashIcon.style.visibility = "visible";
        } else {
            inputField.type = "password";
            slashIcon.style.visibility = "hidden";
        }
    });
});

inputTakers.forEach((val)=>{
    val.addEventListener('copy' , (event)=>{
        const inputValue = val.value;
        event.clipboardData.setData('text/plain', inputValue);
        event.preventDefault();
    })
})


async function sendData() {
    const usernameValue = document.querySelector("#username input").value;
    const passwordValue = document.querySelector("#password input").value;
    try {
        const res = await fetch("http://127.0.0.1:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username : `${usernameValue}`,
                password : `${passwordValue}`
            })
        });

        const data = await res.json();
        if(data.status === "success"){
            statusBox.innerText = "signup Successful";
            statusBox.style.color="#2ecc71";
            setTimeout(()=>{
                window.location.href='/login-page';
            } , 1000);
        }else if(data.status === "user exists"){
            statusBox.innerText = "User exists with current username. Please Choose a different username.";
            statusBox.style.color="#b93f24";
        }else if(data.status === "invalid data"){
            statusBox.innerText = "Something went wrong , try again.";
            statusBox.style.color="#b93f24";
        }

    } catch (err) {
        console.error("Error:", err);
    }
}



const login = document.querySelector(".login-btn");
const usenameRegex = /^[A-Za-z_][A-Za-z0-9_]{0,12}$/ ;
const passwordRegex = /^[A-Za-z0-9_]{8,}$/ ;
login.addEventListener('click' , (event)=>{
    const usernameValue = document.querySelector("#username input").value;
    const passwordValue = document.querySelector("#password input").value;
    const confirmPasswordValue = document.querySelector("#confirm-password input").value;
    if(usernameValue === "" || passwordValue === ""){
        event.preventDefault();
    }
    if(!usenameRegex.test(usernameValue) || usernameValue === ""){
        statusBox.innerText = "Invalid username pattern , Please use c identifier pattern with minimum 1 character and maximum 8 characters.";
        statusBox.style.color="#C62928";
    }else if(!passwordRegex.test(passwordValue) || passwordValue === ""){
        statusBox.innerText = "Invalid password pattern , Please use c identifier pattern with minimum 8 character.";
        statusBox.style.color="#C62928";
    }else if(passwordValue !== confirmPasswordValue){
        event.preventDefault();
        statusBox.innerText = "Password did not match. Please try again using same password in both password fields.";
        statusBox.style.color="#C62928";
    }else{
        event.preventDefault();
        sendData();
        bigBox.classList.add("emerge");
         setTimeout(() => {
           bigBox.classList.remove("emerge");
         }, 300);
    }
})