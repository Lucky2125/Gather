import express from "express";
import { register, login, verifyOTP, adminQuickLogin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/admin-login", adminQuickLogin)

export default authRouter;
