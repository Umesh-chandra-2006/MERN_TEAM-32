import express from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import { EnrollmentModel } from "../models/EnrollmentModel.js";
import { ReviewModel } from "../models/ReviewModel.js";
import mongoose from "mongoose";

export const studentRoute = express.Router();

// Register user
studentRoute.post("/users", async (req, res) => {
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "STUDENT" });
  res.status(201).json({ message: "user created", payload: newUserObj });
});

// Read all active courses (with search and filter)
studentRoute.get("/courses", verifyToken("STUDENT", "INSTRUCTOR", "ADMIN"), async (req, res) => {
  const { q, category, limit } = req.query;
  let filter = { isCourseActive: true };

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ];
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  let query = CourseTypeModel.find(filter)
    .populate("instructor", "firstName lastName profileImageUrl")
    .select("-lectures.videoUrl")
    .sort({ createdAt: -1 });

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  const courses = await query;
  res.status(200).json({ message: "courses fetched", payload: courses });
});

// Enroll in a course
studentRoute.post("/courses/:courseId/enroll", verifyToken("STUDENT"), async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.userId;

  try {
    // Check if course exists
    const course = await CourseTypeModel.findById(courseId);
    if (!course || !course.isCourseActive) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create enrollment
    const enrollment = await EnrollmentModel.create({
      student: studentId,
      course: courseId,
    });

    // Increment total students in course
    await CourseTypeModel.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });

    res.status(201).json({ message: "Enrolled successfully", payload: enrollment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    throw err;
  }
});

// Get my enrolled courses
studentRoute.get("/my-courses", verifyToken("STUDENT"), async (req, res) => {
  const studentId = req.user.userId;
  const enrollments = await EnrollmentModel.find({ student: studentId })
    .populate({
      path: "course",
      populate: { path: "instructor", select: "firstName lastName" }
    });
  res.status(200).json({ message: "My courses", payload: enrollments });
});

// Get course details with progress (for enrolled students)
studentRoute.get("/courses/:courseId", verifyToken("STUDENT"), async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.userId;

  const course = await CourseTypeModel.findById(courseId).populate("instructor", "firstName lastName profileImageUrl");
  if (!course) return res.status(404).json({ message: "Course not found" });

  const enrollment = await EnrollmentModel.findOne({ student: studentId, course: courseId });
  
  res.status(200).json({ 
    message: "Course details", 
    payload: { 
      course, 
      enrollment: enrollment || null 
    } 
  });
});

// Update lecture progress
studentRoute.patch("/courses/:courseId/lectures/:lectureId/progress", verifyToken("STUDENT"), async (req, res) => {
  const { courseId, lectureId } = req.params;
  const studentId = req.user.userId;

  const enrollment = await EnrollmentModel.findOne({ student: studentId, course: courseId });
  if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

  // Add to completed if not already there
  if (!enrollment.completedLectures.some(id => id.toString() === lectureId)) {
    enrollment.completedLectures.push(lectureId);
    
    // Calculate new percentage
    const course = await CourseTypeModel.findById(courseId);
    const totalLectures = course.lectures.length;
    enrollment.progressPercentage = Math.round((enrollment.completedLectures.length / totalLectures) * 100);
    
    await enrollment.save();
  }

  res.status(200).json({ message: "Progress updated", payload: enrollment });
});

// Add or update review
studentRoute.put("/courses/:courseId/reviews", verifyToken("STUDENT"), async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;
  const studentId = req.user.userId;

  // 1. Upsert review
  await ReviewModel.findOneAndUpdate(
    { course: courseId, student: studentId },
    { rating, comment },
    { upsert: true, new: true, runValidators: true }
  );

  // 2. Aggregate new ratings
  const stats = await ReviewModel.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    { 
      $group: { 
        _id: "$course", 
        avgRating: { $avg: "$rating" }, 
        count: { $sum: 1 } 
      } 
    }
  ]);

  // 3. Update course document
  if (stats.length > 0) {
    await CourseTypeModel.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  }

  res.status(200).json({ message: "Review submitted successfully" });
});
