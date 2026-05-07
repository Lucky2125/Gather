import express from "express";
const bookingRouter = express.Router();
import {
  bookEvent,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  sendBookingOTP,
  getAdminBookings,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/auth.js";

bookingRouter.post("/send-otp", protect, sendBookingOTP);
bookingRouter.post("/", protect, bookEvent);
bookingRouter.put("/:id/confirm", protect, admin, confirmBooking);
bookingRouter.get("/my", protect, getMyBookings);
bookingRouter.get("/admin-bookings", protect, admin, getAdminBookings);
bookingRouter.delete("/:id", protect, cancelBooking);

export default bookingRouter;
