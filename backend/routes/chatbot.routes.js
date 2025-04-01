import { chatbot } from "../controllers/OpenAi.controller.js";
import express from "express";

const router = express.Router();
router.get("/gpt/:pp/:prompt", chatbot);
export default router;
