import express from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import bcrypt from "bcryptjs";
export const commonRouter = express.Router();

// Helper to set cookies
const setAuthCookies = (res, accessToken) => {
  res.cookie("token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // Set to true in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

//login
commonRouter.post("/login", async (req, res) => {
  let userCred = req.body;
  let { accessToken, user } = await authenticate(userCred);
  
  setAuthCookies(res, accessToken);
  
  res.status(200).json({ message: "login success", payload: user });
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

//Check authentication status
commonRouter.get("/get-user", verifyToken("STUDENT", "INSTRUCTOR", "ADMIN"), async (req, res) => {
  try {
    const user = await UserTypeModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", payload: user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get profile
commonRouter.get("/profile", verifyToken("STUDENT", "INSTRUCTOR", "ADMIN"), async (req, res) => {
  const user = await UserTypeModel.findById(req.user.userId).select("-password");
  res.status(200).json({ payload: user });
});

// Update profile
commonRouter.patch("/profile", verifyToken("STUDENT", "INSTRUCTOR", "ADMIN"), async (req, res) => {
  const { firstName, lastName, profileImageUrl } = req.body;
  const updatedUser = await UserTypeModel.findByIdAndUpdate(
    req.user.userId,
    { $set: { firstName, lastName, profileImageUrl } },
    { new: true, runValidators: true }
  ).select("-password");
  
  res.status(200).json({ message: "Profile updated", payload: updatedUser });
});

//Change password(Protected route)
commonRouter.put("/change-password", verifyToken("STUDENT", "INSTRUCTOR", "ADMIN"), async (req, res) => {
  //get current password and new password
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  // Prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "newPassword must be different from currentPassword" });
  }

  // Find user by id
  const account = await UserTypeModel.findById(userId);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  // Hash and save new password
  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});


