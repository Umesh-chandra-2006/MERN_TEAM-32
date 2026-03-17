import express from "express";
import { UserTypeModel } from "../models/UserModel.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const adminRoute = express.Router();

// Get all users (except other admins, optional)
adminRoute.get("/users", verifyToken("ADMIN"), async (req, res) => {
  const users = await UserTypeModel.find({ role: { $ne: "ADMIN" } }).select("-password");
  res.status(200).json({ message: "All users", payload: users });
});

// Block/Unblock user
adminRoute.patch("/users/:userId/toggle-status", verifyToken("ADMIN"), async (req, res) => {
  const { userId } = req.params;
  const user = await UserTypeModel.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({ 
    message: `User ${user.isActive ? "unblocked" : "blocked"} successfully`, 
    payload: user 
  });
});

// Get all courses with instructor details
adminRoute.get("/courses", verifyToken("ADMIN"), async (req, res) => {
  const courses = await CourseTypeModel.find()
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "All courses", payload: courses });
});

// Toggle course status (Active/Inactive)
adminRoute.patch("/courses/:courseId/toggle-status", verifyToken("ADMIN"), async (req, res) => {
  const { courseId } = req.params;
  const course = await CourseTypeModel.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.isCourseActive = !course.isCourseActive;
  await course.save();

  res.status(200).json({ 
    message: `Course ${course.isCourseActive ? "activated" : "deactivated"} successfully`, 
    payload: course 
  });
});

// Dashboard Statistics
adminRoute.get("/stats", verifyToken("ADMIN"), async (req, res) => {
  const totalUsers = await UserTypeModel.countDocuments({ role: "STUDENT" });
  const totalInstructors = await UserTypeModel.countDocuments({ role: "INSTRUCTOR" });
  const totalCourses = await CourseTypeModel.countDocuments();
  
  const stats = await CourseTypeModel.aggregate([
    {
      $group: {
        _id: null,
        totalStudentsEnrolled: { $sum: "$totalStudents" },
        avgRating: { $avg: "$averageRating" }
      }
    }
  ]);

  res.status(200).json({
    message: "Admin statistics",
    payload: {
      totalUsers,
      totalInstructors,
      totalCourses,
      totalStudentsEnrolled: stats[0]?.totalStudentsEnrolled || 0,
      averagePlatformRating: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0
    }
  });
});