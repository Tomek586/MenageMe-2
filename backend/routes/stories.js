import express from "express";
import mongoose from "mongoose";
import Story from "../models/Story.js";
import Task  from "../models/Task.js";
import { authenticateToken } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  res.json(await Story.find());
});

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const s = await Story.create(req.body);
    res.json(s);
  }
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const s = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(s);
  }
);

// DELETE /api/stories/:id  
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin","devops","developer"),
  async (req, res) => {
    try {
      const storyId = req.params.id;
      const sid = new mongoose.Types.ObjectId(storyId);

      // 1) Usuń wszystkie taski powiązane
      await Task.deleteMany({ storyId: sid });

      // 2) Usuń story
      await Story.findByIdAndDelete(sid);

      return res.sendStatus(204);
    } catch (err) {
      console.error("Cascade delete story failed:", err);
      return res.status(500).json({ error: "Nie udało się usunąć historyjki i jej zadań" });
    }
  }
);

export default router;