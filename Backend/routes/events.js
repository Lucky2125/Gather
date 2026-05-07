import express from "express";
const eventRouter = express.Router();
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} from "../controllers/eventController.js";
import { protect, admin } from "../middleware/auth.js";

eventRouter.get("/", getEvents);
eventRouter.get("/my-events",protect, admin, getMyEvents );
eventRouter.get("/:id", getEventById);
eventRouter.post("/", protect, admin, createEvent);
eventRouter.put("/:id", protect, admin, updateEvent);
eventRouter.delete("/:id", protect, admin, deleteEvent);

export default eventRouter;
