import express from "express";
import Story from "../models/Story.js";
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

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin", "devops", "developer"),
  async (req, res) => {
    await Story.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  }
);

export default router;
