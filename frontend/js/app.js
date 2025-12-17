// ----------------- LOGIN FUNCTION -----------------
async function login(username, password) {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
});


    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Login error:", err);
    return { ok: false, message: "Network error" };
  }
}

// ----------------- CHECK LOGIN -----------------
function getLoggedInUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) return user;
    return null;
  } catch {
    return null;
  }
}
//
// Redirect to index.html if not logged in
//const currentUser = getLoggedInUser();
//if (!currentUser && !window.location.href.includes("index.html")) {
//  alert("Please log in first");
//  window.location.href = "/index.html";
//}

// ----------------- PATIENT FUNCTIONS -----------------
async function listPatients() {
  try {
    const res = await fetch("/api/patients");
    if (!res.ok) throw new Error("Failed to fetch patients");
    return await res.json();
  } catch (err) {
    console.error("Error loading patients:", err);
    return [];
  }
}

async function createPrescription({ patient_id, prescribed_by, drug_name, dosage }) {
  try {
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id, prescribed_by, drug_name, dosage }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error creating prescription:", err);
    return { ok: false };
  }
}

// ----------------- PATIENT UI -----------------
async function loadPatients() {
  const list = await listPatients();
  const sel = document.getElementById("patientSelect");
  sel.innerHTML = "";
  list.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.text = `${p.first_name} ${p.last_name}`;
    sel.appendChild(opt);
  });
}

// ----------------- EVENT LISTENERS -----------------
document.getElementById("refresh")?.addEventListener("click", loadPatients);

document.getElementById("prescribeBtn")?.addEventListener("click", async () => {
  const patient_id = parseInt(document.getElementById("patientSelect").value);
  const drug = document.getElementById("drug").value;
  const dosage = document.getElementById("dosage").value;

  if (!patient_id || !drug || !dosage) {
    alert("Please select a patient and fill in drug and dosage");
    return;
  }

  const user = getLoggedInUser();
  if (!user) {
    alert("User not logged in");
    window.location.href = "/index.html";
    return;
  }

  const res = await createPrescription({ patient_id, prescribed_by: user.id, drug_name: drug, dosage });
  document.getElementById("presMsg").innerText = res.ok ? "Prescription created!" : "Error creating prescription";
});

// ----------------- ACCOUNT / LOGOUT -----------------
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/index.html";
});

// ----------------- QUERY PARAMS -----------------
function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

async function selectPatientFromQuery() {
  const params = getQueryParams();
  if (!params.patientId) return;

  await loadPatients(); // load all patients first
  const sel = document.getElementById("patientSelect");
  const option = Array.from(sel.options).find((o) => o.value === params.patientId);
  if (option) sel.value = params.patientId;
  if (params.patientName) {
    document.getElementById("presMsg").innerText = `Prescribing for ${params.patientName}`;
  }
}

// ----------------- AUTO LOAD -----------------
loadPatients();
selectPatientFromQuery();
