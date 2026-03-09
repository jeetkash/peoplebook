import { db } from "./firebase.js"

import{
doc,
getDoc,
updateDoc,
collection,
addDoc,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"


const params = new URLSearchParams(window.location.search)
const id = params.get("id")


async function loadIntel(){

const ref = doc(db,"intel",id)
const snap = await getDoc(ref)

const intel = snap.data()

document.getElementById("intelTitle").innerText = intel.title
document.getElementById("intelSource").innerText = intel.source
document.getElementById("intelDate").innerText = intel.dateHeard
document.getElementById("intelStatus").innerText = intel.status
document.getElementById("intelConfidence").innerText = intel.confidence
document.getElementById("intelText").innerText = intel.text

}

loadIntel()

loadSubIntel()

// OPEN EDIT MODAL
async function openEditIntel(){

const ref = doc(db,"intel",id)
const snap = await getDoc(ref)
const intel = snap.data()

document.getElementById("edit_title").value = intel.title
document.getElementById("edit_source").value = intel.source
document.getElementById("edit_dateHeard").value = intel.dateHeard
document.getElementById("edit_text").value = intel.text
document.getElementById("edit_confidence").value = intel.confidence
document.getElementById("edit_status").value = intel.status

document.getElementById("editIntelModal").style.display="flex"

}

window.openEditIntel = openEditIntel


// SAVE EDIT
async function saveIntelEdit(){

const data = {

title:document.getElementById("edit_title").value,
source:document.getElementById("edit_source").value,
dateHeard:document.getElementById("edit_dateHeard").value,
text:document.getElementById("edit_text").value,
confidence:document.getElementById("edit_confidence").value,
status:document.getElementById("edit_status").value

}

await updateDoc(doc(db,"intel",id),data)

closeIntelModal()
loadIntel()

}

window.saveIntelEdit = saveIntelEdit


function closeIntelModal(){
document.getElementById("editIntelModal").style.display="none"
}

window.closeIntelModal = closeIntelModal


// ADD SUB INTEL
async function addSubIntel(){

const text = document.getElementById("subIntelText").value

if(!text) return

await addDoc(collection(db,"subintel"),{

parentIntel:id,
text:text,
date:new Date().toISOString()

})

document.getElementById("subIntelText").value=""

loadSubIntel()

}

window.addSubIntel = addSubIntel


// LOAD SUB INTEL
async function loadSubIntel(){

const q = query(
collection(db,"subintel"),
where("parentIntel","==",id)
)

const snap = await getDocs(q)

let html=""

snap.forEach(d=>{

const s = d.data()

html+=`
<div class="logItem">

<b>${new Date(s.date).toLocaleDateString()}</b>

<p>${s.text}</p>

</div>
`

})

document.getElementById("subIntelList").innerHTML = html

}
