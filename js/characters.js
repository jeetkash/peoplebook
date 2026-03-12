import { db } from "./firebase.js"

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"



async function loadCharacters(){

const peopleSnap = await getDocs(collection(db,"people"))
const journalSnap = await getDocs(collection(db,"journal"))

let html=""

peopleSnap.forEach(personDoc=>{

const p = personDoc.data()
const name = p.name

let memoryCount = 0

journalSnap.forEach(jDoc=>{

const j = jDoc.data()

if((j.characters || []).includes(name)){
memoryCount++
}

})


html += `

<div class="logItem">

<h3>${name}</h3>

<p>Trust: ${p.trust || 0}</p>

<p>Memories: ${memoryCount}</p>

<button onclick="openCharacter('${personDoc.id}')">
View Profile
</button>

</div>

`

})

document.getElementById("characterGrid").innerHTML = html

}

loadCharacters()



function openCharacter(id){

window.location = `profile.html?id=${id}`

}

window.openCharacter = openCharacter
