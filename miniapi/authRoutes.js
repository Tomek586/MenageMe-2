const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const users = require("./users");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("./auth");

// Middleware do autoryzacji
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Brak tokenu" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Nieprawidłowy token" });
    req.user = user;
    next();
  });
};

// LOGIN
router.post("/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Nieprawidłowe dane logowania" });
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ token, refreshToken });
});

// REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = verifyRefreshToken(token);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: "Użytkownik nie istnieje" });

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Nieprawidłowy refresh token" });
  }
});

// GET /me – dane zalogowanego użytkownika
router.get("/me", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

  const { password, ...userData } = user;
  res.json(userData);
});

module.exports = router;
