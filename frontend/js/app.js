const API = "http://localhost:3000/api";

document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!username || !password) {
    msg.innerText = "Please enter username and password";
    return;
  }

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      alert("Login success!");
      window.location.href = data.redirect; 
    } else {
      alert(data.message);
    }
  })
  .catch(err => console.error("Error:", err));
}


// Patients
async function listPatients() {
  const res = await fetch(`${API}/patients`);
  return res.json();
}

// Prescriptions
async function createPrescription(data) {
  const res = await fetch(`${API}/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Vitals
async function addVitals(patient_id, vitals) {
  const res = await fetch(`${API}/vitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id, ...vitals }),
  });
  return res.json();
}

// Patient history
async function getPatientHistory(id) {
  const res = await fetch(`${API}/patient/${id}/history`);
  return res.json();
}

// Pending prescriptions
async function pendingPrescriptions() {
  const res = await fetch(`${API}/prescriptions/pending`);
  return res.json();
}

// Dispense
async function dispensePrescription(id) {
  const res = await fetch(`${API}/prescriptions/${id}/dispense`, { method: "PATCH" });
  return res.json();
}
