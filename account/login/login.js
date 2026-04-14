const show = document.querySelectorAll(".show");
const password = document.querySelector("#password input");
const slash = document.querySelector("#slash");
const statusBox= document.querySelector(".status-box");
const inputTakers = document.querySelectorAll(".input-data input");

show.forEach((val)=>{
    val.addEventListener('click' , ()=>{
    if(password.type === "password"){
        password.type = "text";
        slash.style.visibility = "visible";
    }else{
        password.type = "password";
        slash.style.visibility = "hidden";

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

async function checkData() {
    const usernameValue = document.querySelector("#username input").value;
    const passwordValue = document.querySelector("#password input").value;
    try {
        const res = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username : usernameValue , password : passwordValue})
        });

        const data = await res.json();
        console.log(data);
        if(data.status === "invalid data"){
            statusBox.innerText = "Something went wrong , please try again.";
            statusBox.style.color="#b93f24";
        }else if(data.status === "no user"){
            statusBox.innerText = "No user exists with current username.";
            statusBox.style.color="#b93f24";
        }else if(data.status === "wrong password"){
            statusBox.innerText = "Wrong password , try again with the correct one.";
            statusBox.style.color="#b93f24";
        }else if(data.status === "success"){
            statusBox.innerText = "Login Successful";
            statusBox.style.color="#2ecc71";
            setTimeout(()=>{
                window.location.href='/home/home.html';
            } , 1000);
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
    if(usernameValue === "" || passwordValue === ""){
        event.preventDefault();
    }
    if(!usenameRegex.test(usernameValue) || usernameValue === ""){
        statusBox.innerText = "Invalid username pattern , Please use c identifier pattern with minimum 1 character and maximum 8 characters.";
        statusBox.style.color="#C62928";
    }else if(!passwordRegex.test(passwordValue) || passwordValue === ""){
        statusBox.innerText = "Invalid password pattern , Please use c identifier pattern with minimum 8 character.";
        statusBox.style.color="#C62928";
    }else{
        event.preventDefault();
        checkData();
    }
})