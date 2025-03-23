import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  announcementType: {
    type: String,
    enum: ["major", "subject"],
    required: true,
  },
  targetMajor: {
    type: String,
    enum: [
      "Computer Science",
      "Computer Engineering",
      "Accounting",
      "Sports Training",
      "Dental Lab",
    ],
    required: function () {
      return this.announcementType === "major";
    },
  },
  targetSubject: {
    type: String,
    required: function () {
      return this.announcementType === "subject";
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
