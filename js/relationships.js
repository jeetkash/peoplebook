import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const relRef = collection(db, "relationships");

console.log("🔥 JS LOADED");

window.addEventListener("load", () => {
  const btn = document.getElementById("addRelBtn");

  console.log("Button:", btn);

  btn.onclick = async () => {

    const personA = document.getElementById("personA").value;
    const personB = document.getElementById("personB").value;
    const status = document.getElementById("status").value;
    const tagsInput = document.getElementById("tags").value;

    const tags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t);

    if (!personA || !personB) {
      alert("Enter both names");
      return;
    }

    try {
      await addDoc(relRef, {
        personA,
        personB,
        status,
        tags,
        createdAt: new Date()
      });

      console.log("✅ Saved to Firestore");

      loadRelationships();

    } catch (err) {
      console.error("❌ Firestore error:", err);
    }
  };

  loadRelationships();
});


// 🔥 SHOW RELATIONSHIPS ON SAME PAGE
async function loadRelationships() {
  const container = document.getElementById("relationshipList");

  const snapshot = await getDocs(relRef);

  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${data.personA}</strong> ↔ <strong>${data.personB}</strong><br>
      <span style="color: gold">${data.status}</span>
      <div class="tags">${data.tags?.join(", ") || ""}</div>

      <div style="margin-top:10px;">
        <button onclick="deleteRel('${docSnap.id}')">Delete</button>
        <button onclick="editRel('${docSnap.id}', '${data.status}', '${data.tags?.join(",") || ""}')">Edit</button>
      </div>
    `;

    container.appendChild(div);
  });
}


// 🔗 FOR NETWORK PAGE
export async function getRelationships() {
  const snapshot = await getDocs(relRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 🔥 DELETE
window.deleteRel = async function (id) {
  await deleteDoc(doc(db, "relationships", id));
  loadRelationships();
};

// 🔥 EDIT
window.editRel = async function (id, currentStatus, currentTags) {
  const newStatus = prompt("Update status:", currentStatus);
  const newTags = prompt("Update tags (comma separated):", currentTags);

  if (!newStatus) return;

  await updateDoc(doc(db, "relationships", id), {
    status: newStatus,
    tags: newTags.split(",").map(t => t.trim())
  });

  loadRelationships();
};