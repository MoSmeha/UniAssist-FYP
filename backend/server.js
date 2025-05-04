import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors

// Import routes
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import annonncementRoutes from "./routes/announcements.routes.js";
import openaiRoutes from "./routes/chatbot.routes.js";
import appointmentRoutes from "./routes/appointments.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";

// Import DB connection and socket setup
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server, io } from "./socket/socket.js"; // Import app, server, io from socket.js

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ // Add CORS middleware for Express routes
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(express.json()); // To parse JSON payloads
app.use(cookieParser()); // To parse cookies

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sch", scheduleRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/announcements", annonncementRoutes);
app.use("/api/chatbot", openaiRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files (Frontend build)
// Ensure the frontend build path is correct
const frontendDistPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendDistPath));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  // Check if the request is for an API route, if so, skip sending index.html
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Start server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});

