import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/Notification.js"; // Import Notification model
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	 try {
		 const { message } = req.body;
		 const { id: receiverId } = req.params;
		 const senderId = req.user._id;

		 let conversation = await Conversation.findOne({
			 participants: { $all: [senderId, receiverId] },
		 });

		 if (!conversation) {
			 conversation = await Conversation.create({
				 participants: [senderId, receiverId],
			 });
		 }

		 const newMessage = new Message({
			 senderId,
			 receiverId,
			 message,
		 });

		 if (newMessage) {
			 conversation.messages.push(newMessage._id);
		 }

		 // Save message and conversation
		 await Promise.all([conversation.save(), newMessage.save()]);

		 // *** Create Notification for the receiver ***
		 const notification = await Notification.create({
			 to: receiverId,
			 from: senderId,
			 type: "new_message",
			 message: `New message from ${req.user.fullName}: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
			 relatedId: conversation._id, // Link notification to the conversation
		 });

		 // SOCKET IO FUNCTIONALITY
		 const receiverSocketId = getReceiverSocketId(receiverId);
		 if (receiverSocketId) {
			 // Emit new message event
			 io.to(receiverSocketId).emit("newMessage", newMessage);
			 // Emit new notification event
			 io.to(receiverSocketId).emit("newNotification", notification);
		 }

		 res.status(201).json(newMessage);
	 } catch (error) {
		 console.log("Error in sendMessage controller: ", error.message);
		 res.status(500).json({ error: "Internal server error" });
	 }
};

export const getMessages = async (req, res) => {
	 try {
		 const { id: userToChatId } = req.params;
		 const senderId = req.user._id;

		 const conversation = await Conversation.findOne({
			 participants: { $all: [senderId, userToChatId] },
		 }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		 if (!conversation) return res.status(200).json([]);

		 const messages = conversation.messages;

		 res.status(200).json(messages);
	 } catch (error) {
		 console.log("Error in getMessages controller: ", error.message);
		 res.status(500).json({ error: "Internal server error" });
	 }
};

