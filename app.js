import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_UEeoi9vk5hBZ81tLdio-de9WST40F-A",
  authDomain: "tournament-lock-system.firebaseapp.com",
  projectId: "tournament-lock-system",
  storageBucket: "tournament-lock-system.firebasestorage.app",
  messagingSenderId: "89751386172",
  appId: "1:89751386172:web:80130fb609c99943522b39"
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
