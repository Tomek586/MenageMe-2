import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  name: String,
  description: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  state: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Story", storySchema);
