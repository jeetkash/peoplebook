
import { db } from "./firebase.js";

import {
collection,
addDoc,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// GET PERSON ID FROM URL
const params = new URLSearchParams(window.location.search);
const personID = params.get("id");


// LOAD EXISTING PERSON DATA IF EDITING
async function loadPerson(){

if(!personID) return;

const ref = doc(db,"people",personID);
const snap = await getDoc(ref);
const p = snap.data();

document.getElementById("name").value = p.name || "";
document.getElementById("fullName").value = p.fullName || "";
document.getElementById("nickname").value = p.nickname || "";
document.getElementById("gender").value = p.gender || "";

document.getElementById("course").value = p.course || "";
document.getElementById("college").value = p.college || "";

document.getElementById("phone").value = p.phone || "";
document.getElementById("instagram").value = p.instagram || "";

document.getElementById("whereMet").value = p.whereMet || "";
document.getElementById("firstMet").value = p.firstMet || "";

document.getElementById("firstImpression").value = p.firstImpression || "";

document.getElementById("tags").value = p.tags || "";

document.getElementById("trust").value = p.trust || 0;
document.getElementById("reliability").value = p.reliability || 0;
document.getElementById("influence").value = p.influence || 0;
document.getElementById("risk").value = p.risk || 0;

document.getElementById("notes").value = p.notes || "";

// CHANGE TITLE TO EDIT MODE
const title = document.getElementById("formTitle");
if(title) title.innerText = "Edit Person";

}


// SAVE OR UPDATE PERSON
async function savePerson(){

let data = {

name:document.getElementById("name").value,
fullName:document.getElementById("fullName").value,
nickname:document.getElementById("nickname").value,
gender:document.getElementById("gender").value,

course:document.getElementById("course").value,
college:document.getElementById("college").value,

phone:document.getElementById("phone").value,
instagram:document.getElementById("instagram").value,

whereMet:document.getElementById("whereMet").value,
firstMet:document.getElementById("firstMet").value,

firstImpression:document.getElementById("firstImpression").value,

tags:document.getElementById("tags").value,

trust:document.getElementById("trust").value,
reliability:document.getElementById("reliability").value,
influence:document.getElementById("influence").value,
risk:document.getElementById("risk").value,

notes:document.getElementById("notes").value

};


// UPDATE EXISTING PERSON
if(personID){

await updateDoc(doc(db,"people",personID),data);

alert("Person updated");

}

// CREATE NEW PERSON
else{

await addDoc(collection(db,"people"),data);

alert("Person added");

}

window.location="dashboard.html";

}


// MAKE FUNCTION GLOBAL
window.savePerson = savePerson;


// LOAD PERSON IF EDITING
loadPerson();
