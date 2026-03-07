import {db} from "./firebase.js"

import{
collection,
getDocs,
deleteDoc,
doc
}from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"


let peopleData=[]

async function loadPeople(){

const snap=await getDocs(collection(db,"people"))

let html=""
let i=1

peopleData=[]

snap.forEach(d=>{

let p=d.data()

peopleData.push({id:d.id,...p})

html+=rowHTML(i,p,d.id)

i++

})

document.getElementById("peopleTable").innerHTML=html

}


function rowHTML(i,p,id){

return`

<tr>

<td>${i}</td>

<td>${p.name}</td>

<td>${p.trust || 0}</td>

<td>

<button onclick="viewPerson('${id}')">
View
</button>

<button onclick="deletePerson('${id}')">
Delete
</button>

</td>

</tr>

`

}



function searchPeople(){

let q=document.getElementById("searchInput").value.toLowerCase()

let html=""
let i=1

peopleData.forEach(p=>{

if(p.name.toLowerCase().includes(q)){

html+=rowHTML(i,p,p.id)

i++

}

})

document.getElementById("peopleTable").innerHTML=html

}



function viewPerson(id){

window.location="profile.html?id="+id

}



async function deletePerson(id){

if(confirm("Delete person?")){

await deleteDoc(doc(db,"people",id))

loadPeople()

}

}

window.viewPerson=viewPerson
window.deletePerson=deletePerson
window.searchPeople=searchPeople

loadPeople()
