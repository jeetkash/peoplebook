import { db } from "./firebase.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function loadTimeline(){

let events = []


/* JOURNAL */

const journalSnap = await getDocs(collection(db,"journal"))

journalSnap.forEach(d=>{
events.push({
type:"journal",
...d.data()
})
})


/* INTEL */

const intelSnap = await getDocs(collection(db,"intel"))

intelSnap.forEach(d=>{
events.push({
type:"intel",
...d.data()
})
})


/* LOGS */

const logsSnap = await getDocs(collection(db,"logs"))

logsSnap.forEach(d=>{
events.push({
type:"log",
...d.data()
})
})


/* SORT */

events.sort((a,b)=> new Date(b.date) - new Date(a.date))


/* DISPLAY */

let html=""

events.forEach(e=>{

let icon = "🟡"

if(e.type === "intel") icon = "🔴"
if(e.type === "log") icon = "🔵"

html += `

<div class="timelineItem">

<h3>${icon} ${e.title || "Entry"}</h3>

<p><b>Date:</b> ${e.date || ""}</p>

<p>${e.text || e.description || ""}</p>

</div>

`

})

document.getElementById("timelineContainer").innerHTML = html

}

loadTimeline()
