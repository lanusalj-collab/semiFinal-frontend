import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: {
      userId: { type: String },
      name: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", updateSchema);
export default Update;


