// Firebase importlari
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBXJSvrT31Bss6bs-WJe_Hm1kyccip2P_4",
  authDomain: "sorovnoma-93601.firebaseapp.com",
  databaseURL: "https://sorovnoma-93601-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sorovnoma-93601",
  storageBucket: "sorovnoma-93601.firebasestorage.app",
  messagingSenderId: "607837032856",
  appId: "1:607837032856:web:a319a6e101b92c12d25bed",
  measurementId: "G-Q3KH2LFVTW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// So‘rovnomadagi savollar
const questions = {
  q1: ['Ha', 'Yo‘q'],
  q2: ['Ha albatta', 'Kerakli ekan', 'Yo‘q']
};

// Har bir savol uchun real-time natijalarni olish
Object.keys(questions).forEach(qid => {
  // Ko‘rishlar sonini oshirish
  const viewsRef = ref(db, `polls/${qid}/views`);
  runTransaction(viewsRef, current => (current || 0) + 1);

  // Ko‘rishlarni ko‘rsatish
  onValue(viewsRef, snapshot => {
    document.getElementById(`views-${qid}`).innerText = `👁 ${snapshot.val() || 0} kishi ko‘rdi`;
  });

  // Ovozlar uchun natijalar
  const votesRef = ref(db, `polls/${qid}/votes`);
  onValue(votesRef, snapshot => {
    const data = snapshot.val() || {};
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

    const resultDiv = document.getElementById(`result-${qid}`);
    resultDiv.innerHTML = '';

    questions[qid].forEach(opt => {
      const count = data[opt] || 0;
      const percent = Math.round((count / total) * 100);
      resultDiv.innerHTML += `
        <div style="margin-top: 5px;">
          ${opt}: ${count} ta (${percent}%)
          <div class="bar" style="width: ${percent}%"></div>
        </div>
      `;
    });
  });
});
a
// Ovoz berish funksiyasi
window.vote = (qid, option) => {
  const voteRef = ref(db, `polls/${qid}/votes/${option}`);
  runTransaction(voteRef, current => (current || 0) + 1);
};
