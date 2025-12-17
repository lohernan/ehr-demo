// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static frontend files

// ------------------- CONTROLLERS -------------------
const userController = {
  loginUser: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ ok: false, message: "Username and password required" });
    }

    db.query(
      "SELECT * FROM users WHERE username=? AND password=?",
      [username, password],
      (err, results) => {
        if (err) return res.status(500).json({ ok: false, message: "Server error" });

        if (results.length === 0) {
          return res.json({ ok: false, message: "Invalid credentials" });
        }

        const user = results[0];
        const role = user.role.toLowerCase();

        // Decide redirect page based on role
        let redirect = "/index.html";
        if (role === "doctor") redirect = "/doctor.html";
        else if (role === "nurse") redirect = "/nurse.html";
        else if (role === "pharmacist") redirect = "/pharmacist.html";
        else if (role === "patient") redirect = "/patient.html";

        res.json({ ok: true, redirect, user });
      }
    );
  },
};

// ------------------- API ROUTES -------------------

// Login
app.post("/api/login", userController.loginUser);

// Get all patients
app.get("/api/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    res.json(results);
  });
});

// Add prescription
app.post("/api/prescriptions", (req, res) => {
  const { patient_id, prescribed_by, drug_name, dosage } = req.body;
  const sql =
    "INSERT INTO prescriptions (patient_id, prescribed_by, drug_name, dosage, status) VALUES (?, ?, ?, ?, 'PENDING')";
  db.query(sql, [patient_id, prescribed_by, drug_name, dosage], (err, result) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    res.json({ ok: true, id: result.insertId });
  });
});

// Add vitals
app.post("/api/vitals", (req, res) => {
  const { patient_id, recorded_by, bp, heart_rate, temperature, notes } = req.body;
  const sql =
    "INSERT INTO vitals (patient_id, recorded_by, bp, heart_rate, temperature, notes) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [patient_id, recorded_by, bp, heart_rate, temperature, notes], (err, result) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    res.json({ ok: true, id: result.insertId });
  });
});

// Get patient history
app.get("/api/patient/:id/history", (req, res) => {
  const id = req.params.id;
  const history = {};
  db.query("SELECT * FROM vitals WHERE patient_id=?", [id], (err, vitals) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    history.vitals = vitals;
    db.query("SELECT * FROM prescriptions WHERE patient_id=?", [id], (err2, prescriptions) => {
      if (err2) return res.status(500).json({ ok: false, error: err2 });
      history.prescriptions = prescriptions;
      res.json(history);
    });
  });
});

// Get pending prescriptions
app.get("/api/prescriptions/pending", (req, res) => {
  db.query(
    "SELECT p.id, p.drug_name, p.dosage, pat.first_name, pat.last_name FROM prescriptions p JOIN patients pat ON p.patient_id=pat.id WHERE p.status='PENDING'",
    (err, results) => {
      if (err) return res.status(500).json({ ok: false, error: err });
      res.json(results);
    }
  );
});

// Dispense prescription
app.patch("/api/prescriptions/:id/dispense", (req, res) => {
  const id = req.params.id;
  db.query("UPDATE prescriptions SET status='DISPENSED' WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    res.json({ ok: true });
  });
});

// Patient search
app.get("/search", (req, res) => {
  const { last_name, first_name, dob, phone } = req.query;

  let sql = "SELECT * FROM patients WHERE 1=1";
  const params = [];

  if (last_name) {
    sql += " AND last_name LIKE ?";
    params.push(`%${last_name}%`);
  }
  if (first_name) {
    sql += " AND first_name LIKE ?";
    params.push(`%${first_name}%`);
  }
  if (dob) {
    sql += " AND dob = ?";
    params.push(dob);
  }
  if (phone) {
    sql += " AND phone LIKE ?";
    params.push(`%${phone}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("<p style='color:red;'>Server error while searching.</p>");
    if (results.length === 0) return res.send("<p>No matching patients found.</p>");

    const html = results
      .map(
        (row) => `
          <div class="result-item">
            <button onclick="window.location.href='/doctor.html?patientId=${row.id}&patientName=${encodeURIComponent(
          row.first_name + " " + row.last_name
        )}'">
              ${row.first_name} ${row.last_name}
            </button><br>
            DOB: ${row.dob ? row.dob.toISOString().split("T")[0] : ""}<br>
            Phone: ${row.phone}
          </div>
        `
      )
      .join("");

    res.send(html);
  });
});

// ------------------- CATCH-ALL FRONTEND -------------------
// This must come AFTER all API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
