import Todo from "../models/todo.model.js";
import Notification from "../models/Notification.js"; // Import Notification model
import { getReceiverSocketId, io } from "../socket/socket.js"; // Import socket functions
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

// Get todos for logged-in user
export const getTodoList = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ date: 1, startTime: 1 }); // Sort by date/time
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new todo
export const postTodo = async (req, res) => {
  const { title, description, date, startTime, endTime, completed, priority } =
    req.body;
  const userId = req.user._id;

  // Validate required fields
  if (!title || !date || !priority) {
    return res
      .status(400)
      .json({ message: "Title, date, and priority are required." });
  }

  // Ensure priority has a valid value
  if (!["Top", "Moderate", "Low"].includes(priority)) {
    return res.status(400).json({ message: "Invalid priority value." });
  }

  try {
    const newTodo = new Todo({
      title,
      description: description || "",
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      completed: completed ?? false,
      priority,
      userId: userId,
    });

    await newTodo.save();

    // --- Create Notification --- 
    const notification = await Notification.create({
        to: userId,
        from: userId, // Or system ID if preferred
        type: "todo_created",
        message: `New Todo added: ${title}`,
        relatedId: newTodo._id,
    });

    // --- Emit Socket Event --- 
    const receiverSocketId = getReceiverSocketId(userId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
    }
    // --- End Notification Logic ---

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Update an existing todo
export const updateTodo = async (req, res) => {
  const userId = req.user._id;
  const todoId = req.params.id;

  try {
    const allowedUpdates = [
      "title",
      "description",
      "date",
      "startTime",
      "endTime",
      "completed",
      "priority",
    ];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid update fields." });
    }

    if (
      req.body.priority &&
      !["Top", "Moderate", "Low"].includes(req.body.priority)
    ) {
      return res.status(400).json({ message: "Invalid priority value." });
    }

    const todo = await Todo.findOne({
      _id: todoId,
      userId: userId,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    // Track if completion status changed
    const completedBefore = todo.completed;
    updates.forEach((update) => {
      todo[update] = req.body[update];
    });
    const completedAfter = todo.completed;

    const updatedTodo = await todo.save();

    // --- Create Notification --- 
    let notificationMessage = `Todo updated: ${updatedTodo.title}`;
    if (completedBefore !== completedAfter) {
        notificationMessage = `Todo '${updatedTodo.title}' marked as ${completedAfter ? 'complete' : 'incomplete'}.`;
    }

    const notification = await Notification.create({
        to: userId,
        from: userId, // Or system ID
        type: "todo_updated",
        message: notificationMessage,
        relatedId: updatedTodo._id,
    });

    // --- Emit Socket Event --- 
    const receiverSocketId = getReceiverSocketId(userId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
    }
    // --- End Notification Logic ---

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    // Optional: Could add a notification for deletion if needed
    // Optional: Delete related notifications
     await Notification.deleteMany({ relatedId: todo._id });

    res.json({ message: "Deleted successfully." });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check for upcoming Todo reminders
export const checkTodoReminders = async (req, res) => {
    const userId = req.user._id;
    try {
        const now = new Date();
        const twentyFourHoursLater = new Date(now.getTime() + 60 * 60 * 1000);

        // Find incomplete todos due within the next 24 hours
        const upcomingTodos = await Todo.find({
            userId: userId,
            completed: false,
            date: {
                $gte: now,
                $lte: twentyFourHoursLater
            }
        });

        if (upcomingTodos.length === 0) {
            return res.status(200).json({ message: "No upcoming todo reminders needed." });
        }

        let remindersSentCount = 0;
        const notificationPromises = [];
        const todosToNotify = [];

        // Check if reminders already exist for these todos
        const upcomingTodoIds = upcomingTodos.map(t => t._id);
        const existingReminders = await Notification.find({
            to: userId,
            type: "todo_reminder",
            relatedId: { $in: upcomingTodoIds }
        }).select('relatedId'); // Select only relatedId for efficiency

        const remindedTodoIds = new Set(existingReminders.map(r => r.relatedId.toString()));

        for (const todo of upcomingTodos) {
            // If no reminder exists for this todo, create one
            if (!remindedTodoIds.has(todo._id.toString())) {
                const notificationPromise = Notification.create({
                    to: userId,
                    from: userId, // Or system ID
                    type: "todo_reminder",
                    message: `Reminder: Todo '${todo.title}' is due on ${new Date(todo.date).toLocaleDateString()}.`,
                    relatedId: todo._id,
                });
                notificationPromises.push(notificationPromise);
                todosToNotify.push(notificationPromise); // Store promise to get notification data later
            }
        }

        if (notificationPromises.length > 0) {
            const createdNotifications = await Promise.all(todosToNotify);
            remindersSentCount = createdNotifications.length;

            // Emit socket events for newly created reminders
            const receiverSocketId = getReceiverSocketId(userId.toString());
            if (receiverSocketId) {
                createdNotifications.forEach(notification => {
                    io.to(receiverSocketId).emit("newNotification", notification);
                });
            }
        }

        res.status(200).json({ message: `Checked for reminders. ${remindersSentCount} new reminder(s) sent.` });

    } catch (error) {
        console.error("Error checking todo reminders:", error);
        res.status(500).json({ message: "Server error checking reminders", error: error.message });
    }
};

