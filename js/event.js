import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const eventRef = collection(db, "events");

export async function addEvent(event) {
  await addDoc(eventRef, event);
}

export async function getEvents() {
  const snapshot = await getDocs(eventRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}