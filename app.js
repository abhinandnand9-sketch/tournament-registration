import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("registerBtn").addEventListener("click", async () => {
  const playerName = document.getElementById("playerName").value.trim();
  const teamName = document.getElementById("teamName").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const message = document.getElementById("message");

  if (!playerName || !teamName || !whatsapp) {
    message.textContent = "Fill all fields";
    message.style.color = "red";
    return;
  }

  try {
    const ref = doc(db, "players", whatsapp);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      message.textContent = "WhatsApp already registered";
      message.style.color = "red";
      return;
    }

    await setDoc(ref, {
      playerName,
      teamName,
      whatsapp,
      time: new Date()
    });

    message.textContent = "Registration successful";
    message.style.color = "green";

  } catch (e) {
    message.textContent = "Error. Check console.";
    message.style.color = "red";
    console.error(e);
  }
});
