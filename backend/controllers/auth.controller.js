import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
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
      Department,
      title,
      schedule,
    } = req.body;

    // Check for duplicate email, uniId, or title
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const uniIdExists = await User.findOne({ uniId });
    if (uniIdExists) {
      return res.status(400).json({ error: "University ID already exists" });
    }

    const titleExists = await User.findOne({ title });
    if (titleExists) {
      return res.status(400).json({ error: "Title already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate profile picture using user's name and random color
    function getLightColor() {
      const r = Math.floor(Math.random() * 106) + 150; // 150-255
      const g = Math.floor(Math.random() * 106) + 150; // 150-255
      const b = Math.floor(Math.random() * 106) + 150; // 150-255
      return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); // Convert to hex
    }

    const randomColor = getLightColor();
    const profilePic = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${randomColor}`;

    // Create a new user
    const newUser = new User({
      uniId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      profilePic,
      role,
      Department,
      title,
      schedule: schedule || [], // Initialize with empty schedule array if not provided
    });

    // Save user and generate token if creation was successful
    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        uniId: newUser.uniId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
        role: newUser.role,
        Department: newUser.Department,
        title: newUser.title,
        schedule: newUser.schedule,
      });
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

    // Find the user by uniId
    const user = await User.findOne({ uniId }).select("+password");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Invalid university ID or password" });
    }

    // Generate JWT token
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      uniId: user.uniId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      profilePic: user.profilePic,
      role: user.role,
      Department: user.Department,
      title: user.title,
      schedule: user.schedule,
    });
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
