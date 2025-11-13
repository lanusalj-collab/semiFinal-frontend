import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const sampleProducts = [
  { name: "Nike Air Zoom", price: 5999, image: "nike.jpg", description: "Lightweight and comfy." },
  { name: "Adidas Ultraboost", price: 7999, image: "adidas.jpg", description: "Perfect for running." },
];

await Product.insertMany(sampleProducts);
console.log("✅ Products Seeded");
process.exit();
