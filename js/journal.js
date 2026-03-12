import { db } from "./firebase.js"

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"


// ----------------------------
// CHARACTER TAG SYSTEM
// ----------------------------

let characters = []

function addCharacter(){

const input = document.getElementById("characterInput")

const name = input.value.trim()

if(!name) return

characters.push(name)

renderCharacters()

input.value=""

}

window.addCharacter = addCharacter



function renderCharacters(){

let html=""

characters.forEach((c,i)=>{

html += `
<div style="
display:inline-block;
background:#d4af37;
color:#000;
padding:6px 10px;
border-radius:20px;
margin:4px;
font-size:13px;
">

${c}

<span onclick="removeCharacter(${i})"
style="margin-left:6px; cursor:pointer;">✕</span>

</div>
`

})

document.getElementById("characterList").innerHTML = html

}



function removeCharacter(index){

characters.splice(index,1)

renderCharacters()

}

window.removeCharacter = removeCharacter



// ----------------------------
// ADD JOURNAL EVENT
// ----------------------------

async function addJournal(){

const data = {

title: document.getElementById("title").value,
date: document.getElementById("date").value,
author: document.getElementById("author").value,
text: document.getElementById("text").value,
characters: characters

}

await addDoc(collection(db,"journal"),data)

alert("Journal event added!")

characters = []

renderCharacters()

loadJournal()

}

window.addJournal = addJournal



// ----------------------------
// LOAD JOURNAL EVENTS
// ----------------------------

async function loadJournal(){

const snap = await getDocs(collection(db,"journal"))

let html=""

snap.forEach(d=>{

const j = d.data()
const id = d.id

html += `

<div class="logItem" id="entry-${id}">

<b>${j.date || ""}</b>

<h3>${j.title || ""}</h3>

<p>${j.text || ""}</p>

<p><i>Written by ${j.author || ""}</i></p>

<p><b>Characters:</b> ${(j.characters || []).join(", ")}</p>

<div style="margin-top:10px;">

<button onclick="showEdit('${id}',
'${j.title || ""}',
'${j.date || ""}',
'${j.author || ""}',
\`${j.text || ""}\`)">

✏ Edit
</button>

<button onclick="deleteJournal('${id}')">

🗑 Delete

</button>

</div>

</div>

`

})

document.getElementById("journalList").innerHTML = html

}

loadJournal()



// ----------------------------
// DELETE JOURNAL ENTRY
// ----------------------------

async function deleteJournal(id){

const confirmDelete = confirm("Delete this journal entry?")

if(!confirmDelete) return

await deleteDoc(doc(db,"journal",id))

loadJournal()

}

window.deleteJournal = deleteJournal



// ----------------------------
// SHOW EDIT FORM
// ----------------------------

function showEdit(id,title,date,author,text){

const container = document.getElementById(`entry-${id}`)

container.innerHTML = `

<h3>Edit Journal Entry</h3>

<label>Title</label>
<input id="edit-title-${id}" value="${title}">

<label>Date</label>
<input id="edit-date-${id}" value="${date}">

<label>Author</label>
<input id="edit-author-${id}" value="${author}">

<label>Description</label>
<textarea id="edit-text-${id}">${text}</textarea>

<div style="margin-top:10px;">

<button onclick="saveEdit('${id}')">

Save

</button>

<button onclick="loadJournal()">

Cancel

</button>

</div>

`

}

window.showEdit = showEdit



// ----------------------------
// SAVE EDITED ENTRY
// ----------------------------

async function saveEdit(id){

const title = document.getElementById(`edit-title-${id}`).value
const date = document.getElementById(`edit-date-${id}`).value
const author = document.getElementById(`edit-author-${id}`).value
const text = document.getElementById(`edit-text-${id}`).value

await updateDoc(doc(db,"journal",id),{

title: title,
date: date,
author: author,
text: text

})

loadJournal()

}

window.saveEdit = saveEdit
