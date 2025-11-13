import express from "express";
import Product from "../models/Product.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST new product (for admin use)
router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

export default router;
