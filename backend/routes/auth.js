import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let requestedRole = (req.body.role || "user").toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Determine allowed role:
    // - Default to "user"
    // - Only allow "admin" if caller is authenticated and has admin role
    let finalRole = "user";
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_key");
        if (payload?.role === "admin" && (requestedRole === "admin" || requestedRole === "user")) {
          finalRole = requestedRole;
        }
      }
    } catch {
      // ignore and keep role as "user"
    }
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: finalRole,
    });
    return res.status(201).json({ message: "Registered successfully", userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || "dev_secret_key",
      { expiresIn: "7d" }
    );
    return res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;


