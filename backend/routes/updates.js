import express from "express";
import Update from "../models/Update.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public: list updates (newest first)
router.get("/", async (req, res) => {
  try {
    const items = await Update.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch updates" });
  }
});

// Admin: create a new update/announcement
router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }
    const createdBy = {
      userId: req.user?.userId,
      name: req.user?.name,
      email: req.user?.email,
    };
    const update = await Update.create({ title, message, createdBy });
    res.status(201).json(update);
  } catch (err) {
    res.status(400).json({ message: "Failed to create update" });
  }
});

export default router;


