import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications for the logged-in user
router.get("/my", protectRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({ to: userId })
                                        .populate("from", "fullName username profilePic") // Populate sender details
                                        .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notifications as read for the logged-in user
router.post("/mark-read", protectRoute, async (req, res) => {
  const userId = req.user._id;
  const { notificationIds } = req.body; // Expect an array of notification IDs to mark as read

  if (!notificationIds || !Array.isArray(notificationIds)) {
    return res.status(400).json({ error: "Invalid request: notificationIds array is required." });
  }

  try {
    const result = await Notification.updateMany(
      { _id: { $in: notificationIds }, to: userId }, // Ensure user owns the notifications
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "No matching notifications found for this user." });
    }

    res.status(200).json({ message: `Successfully marked ${result.modifiedCount} notifications as read.` });
  } catch (err) {
    console.error("Error marking notifications as read:", err.message);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

export default router;

