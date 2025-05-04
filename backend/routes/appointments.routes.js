import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import { getReceiverSocketId, io } from "../socket/socket.js"; // Assuming socket logic is exported

const router = express.Router();

// Route to book a new appointment
router.post("/book", protectRoute, async (req, res) => {
  const { teacherId, date, reason } = req.body;
  const studentId = req.user._id; // Get student ID from authenticated user

  if (!teacherId || !date || !reason) {
    return res.status(400).json({ error: "Missing required fields: teacherId, date, reason" });
  }

  try {
    // Create the appointment
    const appointment = await Appointment.create({
      studentId,
      teacherId,
      date,
      reason,
      status: "pending", // Default status
    });

    // Create a notification for the teacher
    const notification = await Notification.create({
      to: teacherId,
      from: studentId,
      type: "appointment_request",
      message: `New appointment requested by ${req.user.fullName} for ${new Date(date).toLocaleString()}`,
      relatedId: appointment._id, // Link notification to the appointment
    });

    // Emit socket event to the teacher if they are online
    const receiverSocketId = getReceiverSocketId(teacherId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }

    res.status(201).json({ appointment });
  } catch (err) {
    console.error("Error booking appointment:", err.message);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Route to get appointments for the logged-in user (student or teacher)
router.get("/my", protectRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    const appointments = await Appointment.find({
      $or: [{ studentId: userId }, { teacherId: userId }],
    })
      .populate("studentId", "fullName username") // Populate student details
      .populate("teacherId", "fullName username") // Populate teacher details
      .sort({ date: -1 }); // Sort by date descending

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Potential future routes for updating status (confirm/cancel)
// router.patch("/:id/status", protectRoute, async (req, res) => { ... });

export default router;

