import express from "express";
import {
  createAnnouncement,
  getAnnouncementsForStudent,
  getTeacherAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import restrictTo from "../middleware/restrictAnnouncement.js";
const router = express.Router();

// Create a new announcement - only teachers can create announcements
router.post("/", protectRoute, restrictTo("teacher"), createAnnouncement);

// Get announcements relevant to the logged-in student
router.get(
  "/student",
  protectRoute,
  restrictTo("student"),
  getAnnouncementsForStudent
);

// Get all announcements created by a teacher
router.get(
  "/teacher",
  protectRoute,
  restrictTo("teacher"),
  getTeacherAnnouncements
);

// Delete an announcement
router.delete("/:id", protectRoute, restrictTo("teacher"), deleteAnnouncement);

export default router;
