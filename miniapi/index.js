const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const users = require("./users");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("./auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST /login
app.post("/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Zawartość tokena (dostępna w frontendzie)
  const tokenPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ id: user.id });

  res.json({ accessToken, refreshToken });
});

// POST /refresh
app.post("/refresh", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = verifyRefreshToken(token);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const tokenPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// GET /me
app.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    res.json(decoded); // Zwróć dane z tokena
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
