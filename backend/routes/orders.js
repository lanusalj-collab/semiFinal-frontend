import express from "express";
import Order from "../models/Order.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST - place an order
router.post("/", authRequired, async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    res.status(400).json({ error: "Order failed" });
  }
});

// GET - view all orders (for admin)
router.get("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
