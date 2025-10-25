const db = require("../config/db");

// -----------------------------
// LOGIN USER
// -----------------------------
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "Username and password required" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }

    const user = results[0];

    // Normalize role to lowercase for easier routing
    const role = user.role.toLowerCase();

    // Determine redirect page based on role
    let redirect = "/dashboard.html";
    if (role === "doctor") redirect = "/patient_search.html";
    else if (role === "nurse") redirect = "/nurse.html";
    else if (role === "pharmacist") redirect = "/pharmacist.html";
    else if (role === "patient") redirect = "/patient.html";


    res.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        role: user.role,
      },
      redirect,
    });
  });
};
