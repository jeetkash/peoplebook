import { db } from "./firebase.js"

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"


// ADD INTEL
async function addIntel(){

const data = {

title: document.getElementById("title").value,
source: document.getElementById("source").value,
dateHeard: document.getElementById("dateHeard").value,
text: document.getElementById("intelText").value,
confidence: document.getElementById("confidence").value,
status: document.getElementById("status").value

}

await addDoc(collection(db,"intel"),data)

clearForm()
loadIntel()

}


// CLEAR FORM AFTER ADD
function clearForm(){

document.getElementById("title").value=""
document.getElementById("source").value=""
document.getElementById("dateHeard").value=""
document.getElementById("intelText").value=""
document.getElementById("confidence").value=5
document.getElementById("status").value="Unverified"

}


// LOAD INTEL LIST
async function loadIntel(){

const snap = await getDocs(collection(db,"intel"))

let html=""

snap.forEach(d=>{

const intel = d.data()
const id = d.id

html += `

<tr>

<td>${intel.title || ""}</td>

<td>${intel.source || ""}</td>

<td>${intel.status || ""}</td>

<td>

<button onclick="viewIntel('${id}')">
View
</button>

<button onclick="editIntel('${id}')">
Edit
</button>

<button onclick="deleteIntel('${id}')">
Delete
</button>

</td>

</tr>

`

})

document.getElementById("intelList").innerHTML = html

}


// VIEW INTEL PAGE
function viewIntel(id){

window.location = "intel-view.html?id=" + id

}


// DELETE INTEL
async function deleteIntel(id){

if(!confirm("Delete this intel?")) return

await deleteDoc(doc(db,"intel",id))

loadIntel()

}


// EDIT INTEL
async function editIntel(id){

const ref = doc(db,"intel",id)

const snap = await getDoc(ref)

const intel = snap.data()

const newTitle = prompt("Edit title",intel.title)

if(!newTitle) return

await updateDoc(ref,{
title:newTitle
})

loadIntel()

}


// GLOBAL FUNCTIONS
window.addIntel = addIntel
window.viewIntel = viewIntel
window.deleteIntel = deleteIntel
window.editIntel = editIntel


// INITIAL LOAD
loadIntel()
