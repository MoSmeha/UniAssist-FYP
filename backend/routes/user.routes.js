//user.routes.js
import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForChatApp } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForChatApp); //api/users

export default router;
