import express from "express";
import Task from "../models/Task.js";
import { authenticateToken } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  res.json(await Task.find());
});

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const t = await Task.create(req.body);
    res.json(t);
  }
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const t = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(t);
  }
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  }
);

export default router;
