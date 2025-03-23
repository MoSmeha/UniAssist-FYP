import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      uniId,
      firstName,
      lastName,
      email,
      password,
      gender,
      role,
      Department, // for teachers
      title, // teacher-specific field
      major, // student-specific field
      schedule,
    } = req.body;

    // Check for duplicate email and uniId
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const uniIdExists = await User.findOne({ uniId });
    if (uniIdExists) {
      return res.status(400).json({ error: "University ID already exists" });
    }

    // For teacher, check that title is unique (if provided)
    if (role === "teacher" && title) {
      const titleExists = await User.findOne({ title });
      if (titleExists) {
        return res.status(400).json({ error: "Title already exists" });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate profile picture using user's name and random light color
    function getLightColor() {
      const r = Math.floor(Math.random() * 106) + 150; // 150-255
      const g = Math.floor(Math.random() * 106) + 150;
      const b = Math.floor(Math.random() * 106) + 150;
      return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    }
    const randomColor = getLightColor();
    const profilePic = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${randomColor}`;

    // Prepare common user data
    let userData = {
      uniId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      profilePic,
      role,
      schedule: schedule || [],
    };

    // Extend userData with role-specific fields
    if (role === "teacher") {
      // Teachers provide a Department and a title.
      userData.Department = Department;
      userData.title = title;
      userData.coursesTaught = []; // Initialize as empty array
    } else if (role === "student") {
      // For students, we assume they provide a major.
      // We set both the student's 'major' field and the base 'Department' to keep the base schema valid.
      userData.Department = Department;
      userData.major = major;
      userData.coursesEnrolled = []; // Initialize as empty array
    }

    // Create and save the new user
    const newUser = new User(userData);

    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      // Build the response payload with common fields
      let responseData = {
        _id: newUser._id,
        uniId: newUser.uniId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
        role: newUser.role,
        schedule: newUser.schedule,
      };

      // Add role-specific data to the response
      if (role === "teacher") {
        responseData.Department = newUser.Department;
        responseData.title = newUser.title;
        responseData.coursesTaught = newUser.coursesTaught;
      } else if (role === "student") {
        responseData.major = newUser.major;
        responseData.coursesEnrolled = newUser.coursesEnrolled;
      }

      res.status(201).json(responseData);
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { uniId, password } = req.body;

    // Find the user by uniId, including the password field
    const user = await User.findOne({ uniId }).select("+password");
    console.log("User found:", user);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    console.log("User found:", user);
    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);

    const isPassCorr = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordCorrect);
    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid university ID or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    // Build the response payload with common fields
    let responseData = {
      _id: user._id,
      uniId: user.uniId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      profilePic: user.profilePic,
      role: user.role,
      schedule: user.schedule,
    };

    // Append role-specific fields
    if (user.role === "teacher") {
      responseData.Department = user.Department;
      responseData.title = user.title;
      responseData.coursesTaught = user.coursesTaught;
    } else if (user.role === "student") {
      responseData.major = user.major;
      responseData.coursesEnrolled = user.coursesEnrolled;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
