import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc,
deleteDoc,
collection,
addDoc,
query,
where,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const params = new URLSearchParams(window.location.search);
const personID = params.get("id");

loadPerson();
loadLogs();


// LOAD PERSON INFO
async function loadPerson(){

if(!personID) return;

const ref = doc(db,"people",personID);
const snap = await getDoc(ref);

if(!snap.exists()) return;

const p = snap.data();

document.getElementById("personInfo").innerHTML = `

<h2>${p.name || ""}</h2>

<p><b>Full Name:</b> ${p.fullName || ""}</p>
<p><b>Nickname:</b> ${p.nickname || ""}</p>
<p><b>Gender:</b> ${p.gender || ""}</p>

<p><b>Course:</b> ${p.course || ""}</p>
<p><b>College:</b> ${p.college || ""}</p>

<p><b>Phone:</b> ${p.phone || ""}</p>
<p><b>Instagram:</b> ${p.instagram || ""}</p>

<p><b>Where Met:</b> ${p.whereMet || ""}</p>
<p><b>First Impression:</b> ${p.firstImpression || ""}</p>

<p><b>Tags:</b> ${p.tags || ""}</p>

<br>

<p><b>Trust:</b> ${p.trust || 0}</p>
<p><b>Reliability:</b> ${p.reliability || 0}</p>
<p><b>Influence:</b> ${p.influence || 0}</p>
<p><b>Risk:</b> ${p.risk || 0}</p>

<br>

<p><b>Notes:</b> ${p.notes || ""}</p>

`;

}

window.loadPerson = loadPerson;



// IMAGE UPLOAD
async function uploadImage(file){

const url = "https://api.cloudinary.com/v1_1/dfgslysua/image/upload";

const formData = new FormData();

formData.append("file",file);
formData.append("upload_preset","peoplebook");

const res = await fetch(url,{
method:"POST",
body:formData
});

const data = await res.json();

return data.secure_url;

}



// ADD LOG
async function addLog(){

const date = document.getElementById("logDate").value;
const text = document.getElementById("logText").value;
const imageFile = document.getElementById("logImage").files[0];

if(!date || !text){
alert("Fill both fields");
return;
}

let imageURL = "";

if(imageFile){
imageURL = await uploadImage(imageFile);
}

await addDoc(collection(db,"logs"),{

personID:personID,
date:date,
text:text,
image:imageURL

});

document.getElementById("logText").value="";
document.getElementById("logImage").value="";
document.getElementById("imagePreview").style.display="none";

loadLogs();

}

window.addLog = addLog;



// LOAD LOGS
async function loadLogs(){

const q = query(
collection(db,"logs"),
where("personID","==",personID)
);

const snap = await getDocs(q);

let logs = [];

snap.forEach(d=>{
logs.push({
id:d.id,
...d.data()
});
});


// SORT NEWEST FIRST
logs.sort((a,b)=> new Date(b.date) - new Date(a.date));

let html="";

logs.forEach(l=>{

const logText = l.text || "No log text";

html += `
<div class="logItem">

<b>${l.date || "Unknown date"}</b>

<p>${logText}</p>

${l.image ? `<img src="${l.image}" class="logImage">` : ""}

<div class="logActions">

<button onclick="editLog('${l.id}','${l.date}','${logText.replace(/'/g,"")}')">
Edit
</button>

<button onclick="deleteLog('${l.id}')">
Delete
</button>

</div>

</div>
`;

});

document.getElementById("logsList").innerHTML = html;

}



// DELETE LOG
async function deleteLog(id){

if(!confirm("Delete this log?")) return;

await deleteDoc(doc(db,"logs",id));

loadLogs();

}

window.deleteLog = deleteLog;



// ---------------------
// MODAL BASED LOG EDIT
// ---------------------

let editingLogID = null;

function editLog(id,date,text){

editingLogID = id;

document.getElementById("editLogDate").value = date;
document.getElementById("editLogText").value = text;

document.getElementById("editLogModal").style.display="flex";

}

window.editLog = editLog;



async function saveLogEdit(){

const newDate = document.getElementById("editLogDate").value;
const newText = document.getElementById("editLogText").value;

await updateDoc(doc(db,"logs",editingLogID),{
date:newDate,
text:newText
});

closeLogModal();
loadLogs();

}

window.saveLogEdit = saveLogEdit;



function closeLogModal(){
document.getElementById("editLogModal").style.display="none";
}

window.closeLogModal = closeLogModal;



// ---------------------
// EDIT PERSON
// ---------------------

async function editPerson(){

document.getElementById("editModal").style.display="flex";

const ref = doc(db,"people",personID);
const snap = await getDoc(ref);
const p = snap.data();

document.getElementById("edit_name").value = p.name || "";
document.getElementById("edit_fullName").value = p.fullName || "";
document.getElementById("edit_nickname").value = p.nickname || "";
document.getElementById("edit_gender").value = p.gender || "";

document.getElementById("edit_course").value = p.course || "";
document.getElementById("edit_college").value = p.college || "";

document.getElementById("edit_phone").value = p.phone || "";
document.getElementById("edit_instagram").value = p.instagram || "";

document.getElementById("edit_whereMet").value = p.whereMet || "";
document.getElementById("edit_firstMet").value = p.firstMet || "";

document.getElementById("edit_firstImpression").value = p.firstImpression || "";

document.getElementById("edit_tags").value = p.tags || "";

document.getElementById("edit_trust").value = p.trust || 0;
document.getElementById("edit_reliability").value = p.reliability || 0;
document.getElementById("edit_influence").value = p.influence || 0;
document.getElementById("edit_risk").value = p.risk || 0;

document.getElementById("edit_notes").value = p.notes || "";

}

window.editPerson = editPerson;



// SAVE PERSON EDIT
async function saveEdit(){

const data = {

name:document.getElementById("edit_name").value,
fullName:document.getElementById("edit_fullName").value,
nickname:document.getElementById("edit_nickname").value,
gender:document.getElementById("edit_gender").value,

course:document.getElementById("edit_course").value,
college:document.getElementById("edit_college").value,

phone:document.getElementById("edit_phone").value,
instagram:document.getElementById("edit_instagram").value,

whereMet:document.getElementById("edit_whereMet").value,
firstMet:document.getElementById("edit_firstMet").value,

firstImpression:document.getElementById("edit_firstImpression").value,

tags:document.getElementById("edit_tags").value,

trust:document.getElementById("edit_trust").value,
reliability:document.getElementById("edit_reliability").value,
influence:document.getElementById("edit_influence").value,
risk:document.getElementById("edit_risk").value,

notes:document.getElementById("edit_notes").value

};

await updateDoc(doc(db,"people",personID),data);

closeModal();
loadPerson();

}

window.saveEdit = saveEdit;



function closeModal(){
document.getElementById("editModal").style.display="none";
}

window.closeModal = closeModal;



// IMAGE PREVIEW
function previewImage(){

const file = document.getElementById("logImage").files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(e){

const img = document.getElementById("imagePreview");

img.src = e.target.result;
img.style.display="block";

};

reader.readAsDataURL(file);

}

window.previewImage = previewImage;

