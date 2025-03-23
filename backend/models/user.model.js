import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  subject: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00 AM"
  endTime: { type: String, required: true }, // e.g., "10:30 AM"
  mode: {
    type: String,
    enum: ["campus", "online"],
    required: true,
  },
  room: { type: String, required: true },
});

const options = { discriminatorKey: "role", timestamps: true };

const UserSchema = new mongoose.Schema(
  {
    uniId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, select: false },
    gender: { type: String, required: true, enum: ["male", "female"] },
    profilePic: { type: String, default: "" },
    Department: {
      type: String,
      required: true,
      enum: [
        "Computer and Communications Engineering",
        "Business",
        "Sports Sciences",
        "Public Health",
      ],
    },
    schedule: [ScheduleSchema],
  },
  options
);

const User = mongoose.model("User", UserSchema);

const TeacherSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Head of Engineering"
  coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const Teacher = User.discriminator("teacher", TeacherSchema);

const StudentSchema = new mongoose.Schema({
  major: {
    type: String,
    required: true,
    enum: [
      "Computer Science",
      "Computer Engineering",
      "Accounting",
      "Sports Training",
      "Dental Lab",
    ],
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const Student = User.discriminator("student", StudentSchema);

export { User, Teacher, Student };
