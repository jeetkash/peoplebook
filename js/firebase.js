import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmiYT_O-JUQiQ3zsxUslQnd-0rqAaVGd0",
  authDomain: "notebook-85dd9.firebaseapp.com",
  projectId: "notebook-85dd9",
  storageBucket: "notebook-85dd9.firebasestorage.app",
  messagingSenderId: "66224182026",
  appId: "1:66224182026:web:7cac7523c839d3852920f3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);