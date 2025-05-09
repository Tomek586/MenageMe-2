import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import dotenv from "dotenv";

import User from "../models/User.js";
import { authenticateToken } from "../middleware/authenticate.js";

dotenv.config();
const router = express.Router();

// LOCAL LOGIN 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "1d",
  });
  res.json({ accessToken, refreshToken });
});

// GOOGLE OAUTH
router.post("/google", async (req, res) => {
  const { token } = req.body;
  // 1) verify with Google
  const { data } = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
  );
  const { sub: googleId, email, given_name, family_name } = data;
  // 2) find or create
  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.create({
      googleId,
      email,
      firstName: given_name,
      lastName: family_name,
      role: "guest",
    });
  }
  // 3) jwt
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ accessToken, refreshToken });
});

// REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const { token } = req.body;
  try {
    const { id } = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// GET CURRENT USER
router.get("/me", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-passwordHash -__v"
  );
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export default router;
