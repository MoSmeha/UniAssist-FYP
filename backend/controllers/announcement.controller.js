import Announcement from "../models/announcement.model.js";
import { User, Student } from "../models/user.model.js"; // Import User and Student
import Notification from "../models/Notification.js"; // Import Notification model
import { getReceiverSocketId, io } from "../socket/socket.js"; // Import socket functions

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, content, announcementType, targetMajor, targetSubject } =
      req.body;
    const senderId = req.user._id; // Get sender ID from authenticated user

    // Validate request based on announcement type
    if (announcementType === "major" && !targetMajor) {
      return res
        .status(400)
        .json({ message: "Target major is required for major announcements" });
    }
    if (announcementType === "subject" && !targetSubject) {
      return res.status(400).json({
        message: "Target subject is required for subject announcements",
      });
    }

    // Create the announcement
    const newAnnouncement = new Announcement({
      title,
      content,
      sender: senderId,
      announcementType,
      targetMajor,
      targetSubject,
    });

    await newAnnouncement.save();

    // --- Find target students and create notifications ---
    let targetStudentIds = [];
    if (announcementType === "major") {
      const students = await Student.find({ major: targetMajor }).select("_id");
      targetStudentIds = students.map(s => s._id);
    } else if (announcementType === "subject") {
      // Find students whose schedule contains the target subject
      const students = await Student.find({ "schedule.subject": targetSubject }).select("_id");
      targetStudentIds = students.map(s => s._id);
    }

    // Create notifications and emit socket events
    if (targetStudentIds.length > 0) {
      const notificationPromises = targetStudentIds.map(studentId => {
        return Notification.create({
          to: studentId,
          from: senderId,
          type: "announcement",
          message: `New Announcement: ${title}`,
          relatedId: newAnnouncement._id,
        });
      });

      const createdNotifications = await Promise.all(notificationPromises);

      // Emit socket events to online users
      createdNotifications.forEach(notification => {
        const receiverSocketId = getReceiverSocketId(notification.to.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", notification);
        }
      });
    }
    // --- End Notification Logic ---

    res.status(201).json({
      success: true,
      announcement: newAnnouncement,
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.error("Error creating announcement:", error); // <-- Log full error
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};

// Get all announcements relevant to a specific student
export const getAnnouncementsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming authentication middleware

    // Get the student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all subjects in the student's schedule
    const studentSubjects = student.schedule.map((item) => item.subject);

    // Find announcements that target the student's major or any of their subjects
    // Also include general announcements if applicable (add criteria if needed)
    const announcements = await Announcement.find({
      $or: [
        { announcementType: "major", targetMajor: student.major },
        {
          announcementType: "subject",
          targetSubject: { $in: studentSubjects },
        },
        // { announcementType: "general" } // Add if you have general announcements
      ],
    }).populate(
      "sender",
      "fullName username profilePic Department title createdAt" // Adjusted fields
    ).sort({ createdAt: -1 }); // Sort by creation date

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

// Get all announcements created by a teacher
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming authentication middleware

    const announcements = await Announcement.find({ sender: teacherId })
      .sort({ createdAt: -1 })
      .populate(
        "sender",
        "fullName username profilePic Department title createdAt" // Adjusted fields
      );

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher announcements",
      error: error.message,
    });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Check if the user is the creator of the announcement
    if (announcement.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this announcement" });
    }

    // Optional: Delete related notifications before deleting the announcement
    // await Notification.deleteMany({ relatedId: announcement._id, type: "announcement" });

    await Announcement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

