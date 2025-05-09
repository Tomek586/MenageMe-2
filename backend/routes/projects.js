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

// DELETE /api/projects/:id (z kaskadą)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRole("admin","devops","developer"),
    async (req,res) => {
      console.log("🌪️ DELETE /api/projects/", req.params.id);  // ← zobaczymy w logu
      try {
        const pid = new mongoose.Types.ObjectId(req.params.id);
        const stories = await Story.find({ projectId: pid }).select("_id");
        const storyIds = stories.map(s=>s._id);
        if (storyIds.length) {
          console.log(`Deleting tasks for storyIds=${storyIds}`);
          await Task.deleteMany({ storyId: { $in: storyIds } });
        }
        console.log(`Deleting ${stories.length} stories`);
        await Story.deleteMany({ projectId: pid });
        console.log("Deleting project", pid);
        await Project.findByIdAndDelete(pid);
        return res.sendStatus(204);
      } catch(err) {
        console.error("Cascade delete failed:", err);
        return res.status(500).json({ error:"Failed to cascade delete" });
      }
    }
  );
  
  export default router;