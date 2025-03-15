import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

// Get todos for logged-in user
export const getTodoList = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const postTodo = async (req, res) => {
  const { title, description, date, startTime, endTime, completed } = req.body;

  // Validate required fields
  if (!title || !description || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newTodo = new Todo({
      title,
      description,
      date,
      startTime,
      endTime,
      completed: completed ?? false, // Default to false if not provided
      userId: req.user._id,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Update a todo for logged-in user (supports updating allowed fields)
export const updateTodo = async (req, res) => {
  try {
    // Define which fields can be updated
    const allowedUpdates = [
      "title",
      "description",
      "date",
      "startTime",
      "endTime",
      "completed",
    ];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid updates" });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Not found" });
    }

    // Update only the allowed fields
    updates.forEach((update) => {
      todo[update] = req.body[update];
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete todo (ensure only owner can delete)
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
