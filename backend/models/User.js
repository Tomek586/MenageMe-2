import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  passwordHash: String,
  role: {
    type: String,
    enum: ["admin", "developer", "devops", "guest"],
    default: "guest",
  },
});

export default mongoose.model("User", userSchema);
