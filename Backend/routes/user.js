import express from "express";
import { protect } from "../middleware/auth.js";
import { updateUser } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.put("/update", protect, updateUser);

export default userRouter;
