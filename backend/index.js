import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"; 
import projectRoutes from "./routes/projects.js";
import storyRoutes from "./routes/stories.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("MongoDB connected");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);    
app.use("/api/projects", projectRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => res.send("ManagMe API is running"));

app.listen(process.env.PORT, () =>
  console.log(`Backend running on http://localhost:${process.env.PORT}`)
);
