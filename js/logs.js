import { db } from "./firebase.js";

import {
collection,
addDoc,
query,
where,
getDocs,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

async function loadProfile(){

const ref = doc(db,"people",id);

const snap = await getDoc(ref);

const p = snap.data();

document.getElementById("personName").innerText = p.name;

document.getElementById("profileInfo").innerHTML = `

<p><b>Full Name:</b> ${p.fullName}</p>
<p><b>Course:</b> ${p.course}</p>
<p><b>College:</b> ${p.college}</p>
<p><b>Trust:</b> ${p.trust}</p>
<p><b>Tags:</b> ${p.tags}</p>
<p><b>Notes:</b> ${p.notes}</p>

`;

}

async function addLog(){

const data = {

personID:id,
date:document.getElementById("logDate").value,
location:document.getElementById("logLocation").value,
said:document.getElementById("said").value,
did:document.getElementById("did").value,
thoughts:document.getElementById("thoughts").value

};

await addDoc(collection(db,"logs"),data);

loadLogs();

}

async function loadLogs(){

const q = query(collection(db,"logs"),where("personID","==",id));

const snap = await getDocs(q);

let html="";

snap.forEach((doc)=>{

const l = doc.data();

html += `
<div class="timelineItem">
<b>${l.date}</b>
<p>${l.location}</p>
<p>${l.said}</p>
</div>
`;

});

document.getElementById("timeline").innerHTML = html;

}

loadProfile();
loadLogs();

window.addLog = addLog;

async function editPerson(){

const newName = prompt("Edit name");

if(!newName) return;

await updateDoc(doc(db,"people",id),{

name:newName

})

loadProfile()

}

import {
collection,
addDoc,
query,
where,
getDocs,
doc,
getDoc,
updateDoc,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 

async function deletePerson(){

const confirmDelete = confirm("Delete this person?")

if(!confirmDelete) return

await deleteDoc(doc(db,"people",id))

window.location.href="dashboard.html"

}