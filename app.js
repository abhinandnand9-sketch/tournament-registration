// PROOF THAT JS IS LOADED
alert("JavaScript connected");

// Button click handler
document.getElementById("registerBtn").addEventListener("click", function () {
  const playerName = document.getElementById("playerName").value.trim();
  const teamName = document.getElementById("teamName").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const message = document.getElementById("message");

  if (!playerName || !teamName || !whatsapp) {
    message.style.color = "red";
    message.textContent = "Please fill all fields";
    return;
  }

  // Check duplicate using localStorage
  if (localStorage.getItem(whatsapp)) {
    message.style.color = "red";
    message.textContent = "WhatsApp number already registered";
    return;
  }

  // Save data
  localStorage.setItem(whatsapp, JSON.stringify({
    playerName,
    teamName,
    whatsapp
  }));

  message.style.color = "green";
  message.textContent = "Registration successful";

  // Clear fields
  document.getElementById("playerName").value = "";
  document.getElementById("teamName").value = "";
  document.getElementById("whatsapp").value = "";
});
