import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  subject: { type: String, required: true },
  startTime: { type: String, required: true }, // Example: "09:00 AM"
  endTime: { type: String, required: true }, // Example: "10:30 AM"
  mode: {
    type: String,
    enum: ["campus", "online"],
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    uniId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Increase from 6
      select: false, // Never return in queries
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    Department: {
      type: String,
      required: true,
      enum: [
        "Computer and Communications Engineering",
        "Technology in Computer Science",
        "Human Resource Management",
        "Economics",
        "Accounting, Control, and Auditing",
        "Banking and Finance",
        "Marketing and Management",
        "Nursing Sciences",
        "Dental Laboratory Technology",
        "Physical Therapy",
        "Communication and Journalism",
        "Audiovisual",
        "Graphic Design and Advertising",
        "Music Therapy",
        "European Art Music",
        "General Musicology of Traditions and Arabic Art Music",
        "Music Education Sciences and Music, Technology, and Media",
        "Motricity Education and Adapted Physical Activities",
        "Sports Training",
        "Sports Management",
      ],
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    schedule: [ScheduleSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
