import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
  estimatedTime: Number,
  state: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
  },
  createdAt: { type: Date, default: Date.now },
  startDate: Date,
  endDate: Date,
  workHours: Number,
  assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Task", taskSchema);
