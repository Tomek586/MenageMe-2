import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import Story from "../models/Story.js";
import Task from "../models/Task.js";
import { authenticateToken } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authorize.js";

const router = express.Router();

// GET /api/projects
router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    const list = await Project.find();
    res.json(list);
  }
);

// POST /api/projects
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const p = await Project.create(req.body);
    res.json(p);
  }
);

// PUT /api/projects/:id
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(p);
  }
);

// DELETE /api/projects/:id  usuwanie razem z powiazanymi stories i task
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin","devops","developer"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const pid = new mongoose.Types.ObjectId(projectId);

      // 1) Pobierz wszystkie story dla tego projektu
      const stories = await Story.find({ projectId: pid }).select("_id");
      const storyIds = stories.map(s => s._id);

      // 2) Usuń wszystkie taski powiązane z tymi story
      if (storyIds.length) {
        await Task.deleteMany({ storyId: { $in: storyIds } });
      }

      // 3) Usuń te story
      await Story.deleteMany({ projectId: pid });

      // 4) Usuń sam projekt
      await Project.findByIdAndDelete(pid);

      return res.sendStatus(204);
    } catch (err) {
      console.error("Cascade delete failed:", err);
      return res.status(500).json({ error: "Nie udało się usunąć projektu i powiązanych zadan i historyjek" });
    }
  }
);

export default router;