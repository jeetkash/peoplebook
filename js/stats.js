import { db } from "./firebase.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function loadStats(){

const peopleSnap = await getDocs(collection(db,"people"));
const intelSnap = await getDocs(collection(db,"intel"));
const journalSnap = await getDocs(collection(db,"journal"));

document.getElementById("charactersCount").innerText = peopleSnap.size;
document.getElementById("intelCount").innerText = intelSnap.size;
document.getElementById("memoriesCount").innerText = journalSnap.size;

}

loadStats();
