import { db } from "./firebase.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function calculateStreak(author){

const snap = await getDocs(collection(db,"journal"));

let dates = [];

snap.forEach(d=>{

const j = d.data();

if(j.author === author && j.date){
dates.push(j.date);
}

});

dates = [...new Set(dates)];

dates.sort((a,b)=> new Date(b) - new Date(a));

let streak = 0;
let today = new Date();

for(let i=0;i<dates.length;i++){

let d = new Date(dates[i]);

let diff = Math.floor((today - d) / (1000*60*60*24));

if(diff === streak){
streak++;
}else{
break;
}

}

return streak;

}


async function loadStreaks(){

const jeet = await calculateStreak("Jeet");
const anika = await calculateStreak("Anika");

document.getElementById("jeetStreak").innerText =
`🔥 Jeet Streak: ${jeet} days`;

document.getElementById("anikaStreak").innerText =
`🔥 Anika Streak: ${anika} days`;

}

loadStreaks();
