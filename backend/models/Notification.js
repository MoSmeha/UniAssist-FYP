import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: String,
  type: String, // e.g., 'appointment', 'chat', etc.
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
