const password="himawari_bhen_ki_lori"

function login(){

let input=document.getElementById("password").value

if(input===password){

window.location="dashboard.html"

}else{

document.getElementById("error").innerText="Wrong password"

}

}