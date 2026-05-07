import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/email.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = generateOTP();
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({
      message: "OTP sent to email. Please verify.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("🔍 Login request received:", req.body); // ✅ Add this

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified && user.role !== "admin") {
      const otp = generateOTP();
      await OTP.findOneAndDelete({
        email: user.email,
        action: "account_verification",
      });
      await OTP.create({
        email: user.email,
        otp,
        action: "account_verification",
      });
      await sendOTPEmail(user.email, otp, "account_verification");
      return res.status(403).json({
        message: "Account not verified",
        needsVerification: true,
        email: user.email,
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error("❌ Login Error:", error); // ✅ Add this

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOTP = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!validOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );
    await OTP.deleteOne({ _id: validOTP._id });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const adminQuickLogin = async (req, res) => {
  try {
    const { adminPass } = req.body;

    if (!adminPass) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Get all admin users
    const adminUsers = await User.find({ role: "admin" });

    if (!adminUsers.length) {
      return res.status(404).json({
        success: false,
        message: "No admin users found",
      });
    }

    let matchedAdmin = null;

    // Compare entered password with each admin's hashed password
    for (const admin of adminUsers) {
      const isMatch = await bcrypt.compare(adminPass, admin.password);

      if (isMatch) {
        matchedAdmin = admin;
        break;
      }
    }

    if (!matchedAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin Password",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: matchedAdmin._id,
        role: matchedAdmin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    return res.status(200).json({
      _id: matchedAdmin._id,
      name: matchedAdmin.name,
      email: matchedAdmin.email,
      role: matchedAdmin.role,
      token,
    });
  } catch (error) {
    console.error("ADMIN QUICK LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};
