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

function classChange(val){
    document.querySelector("#workouts").style.width = "50%";
    const plans=document.querySelectorAll(".plans");
    const total = plans.length;
    let changer = 0;
    plans.forEach((shell , index) => {
        const ratio = index / (total - 1 || 1);
        const s = 30 + (ratio * 50);
        const l = 60 - (ratio * 30);
        shell.style.backgroundColor=`hsl(${Math.round(100 + changer*100/(index+1))} , ${s}% , ${l}%)`;
        shell.style.top = `${-changer}px`;
        shell.style.left = `${index*10}px`;
        shell.style.zIndex=`${index}`;
        changer+=75;
        shell.addEventListener('click' , ()=>{
            shell.style.display='none';
        })
    })
}


