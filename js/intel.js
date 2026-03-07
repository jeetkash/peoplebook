import {db} from "./firebase.js"

import{
collection,
addDoc,
getDocs
}from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

async function addIntel(){

let data={

title:document.getElementById("title").value,
source:document.getElementById("source").value,

dateHeard:document.getElementById("dateHeard").value,

text:document.getElementById("intelText").value,

confidence:document.getElementById("confidence").value,

status:document.getElementById("status").value

}

await addDoc(collection(db,"intel"),data)

loadIntel()

}

async function loadIntel(){

const snap=await getDocs(collection(db,"intel"))

let html=""

snap.forEach(d=>{

let i=d.data()

html+=`

<tr>

<td>${i.title}</td>
<td>${i.source}</td>
<td>${i.status}</td>

</tr>

`

})

document.getElementById("intelTable").innerHTML=html

}

window.addIntel=addIntel

loadIntel()