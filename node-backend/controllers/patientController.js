const db = require("../config/db");

// Get all patients
exports.getPatients = (req, res) => {
  const query = "SELECT * FROM patients";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a new patient
exports.addPatient = (req, res) => {
  const { name, age, diagnosis } = req.body;
  const query = "INSERT INTO patients (name, age, diagnosis) VALUES (?, ?, ?)";
  db.query(query, [name, age, diagnosis], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Patient added successfully!" });
  });
};
