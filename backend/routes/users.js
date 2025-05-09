import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = express.Router();

// GET /api/users 
router.get("/", authenticateToken, async (req, res) => {
  const users = await User.find().select("firstName lastName role");
  
  const out = users.map(u => ({
    id: u._id.toString(),
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role
  }));
  res.json(out);
});

export default router;
