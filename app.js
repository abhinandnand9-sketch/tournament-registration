const firebaseConfig = {
  apiKey: "AIzaSyC_UEeoi9vk5hBZ81tLdio-de9WST40F-A",
  authDomain: "tournament-lock-system.firebaseapp.com",
  projectId: "tournament-lock-system",
  storageBucket: "tournament-lock-system.firebasestorage.app",
  messagingSenderId: "89751386172",
  appId: "1:89751386172:web:80130fb609c99943522b39"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// DEVICE ID
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = "dev-" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("device_id", id);
  }
  return id;
}

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// PLAYER REGISTER
async function register() {
  const name = playerName.value.trim();
  const team = teamName.value.trim();
  const whatsapp = whatsapp.value.trim();

  if (!name || !team || !whatsapp) return alert("Fill all details");
  if (whatsapp.length < 10) return alert("Invalid WhatsApp number");

  const deviceId = getDeviceId();
  const deviceRef = db.collection("players").doc(deviceId);
  const deviceSnap = await deviceRef.get();

  // Device already registered
  if (deviceSnap.exists) {
    if (deviceSnap.data().status === "banned") {
      alert("You are banned");
      return;
    }
    showCode(deviceSnap.data().code);
    return;
  }

  // WhatsApp duplicate check
  const waSnap = await db.collection("players")
    .where("whatsapp", "==", whatsapp).get();

  if (!waSnap.empty) {
    alert("This WhatsApp number is already registered");
    return;
  }

  const code = generateCode();
  await deviceRef.set({
    name, team, whatsapp,
    code,
    status: "active",
    createdAt: Date.now()
  });

  showCode(code);
}

function showCode(code) {
  result.classList.remove("hidden");
  codeBox.innerText = code;
}

// ADMIN LOGIN
function adminLogin() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      loginBox.classList.add("hidden");
      dashboard.classList.remove("hidden");
      loadPlayers();
    })
    .catch(() => alert("Invalid admin login"));
}

// LOAD PLAYERS
async function loadPlayers() {
  const table = document.getElementById("playersTable");
  const snap = await db.collection("players").get();

  snap.forEach(doc => {
    const d = doc.data();
    const row = table.insertRow();
    row.innerHTML = `
      <td>${d.name}</td>
      <td>${d.team}</td>
      <td>${d.whatsapp}</td>
      <td>${d.code}</td>
      <td>${d.status}</td>
      <td>
        <button onclick="resetCode('${doc.id}')">Reset</button>
        <button onclick="toggleBan('${doc.id}','${d.status}')">
          ${d.status === "banned" ? "Unban" : "Ban"}
        </button>
      </td>`;
  });
}

async function resetCode(id) {
  await db.collection("players").doc(id)
    .update({ code: generateCode() });
  location.reload();
}

async function toggleBan(id, status) {
  await db.collection("players").doc(id)
    .update({ status: status === "banned" ? "active" : "banned" });
  location.reload();
}

// EXPORT
async function exportExcel() {
  const snap = await db.collection("players").get();
  let csv = "Player,Team,WhatsApp,Code,Status\n";

  snap.forEach(doc => {
    const d = doc.data();
    csv += `${d.name},${d.team},${d.whatsapp},${d.code},${d.status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "players.csv";
  link.click();
}
