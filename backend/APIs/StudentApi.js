import exp from "express";
import mongoose from "mongoose";
import { register, authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import { EnrollmentModel } from "../models/EnrollmentModel.js";
import { ReviewModel } from "../models/ReviewModel.js";


export const studentRoute = exp.Router();

// ================= REGISTER =================
studentRoute.post("/register", async (req, res, next) => {
  try {
    const newUser = await register({
      ...req.body,
      role: "STUDENT",
    });

    res.status(201).json({
      message: "Student registered successfully",
      payload: newUser,
    });
  } catch (err) {
    next(err);
  }



});

// ================= LOGIN =================
studentRoute.post("/login", async (req, res, next) => {
  try {
    const { token, user } = await authenticate(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      message: "Login successful",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});

// ================= LOGOUT =================
studentRoute.post("/logout", verifyToken("STUDENT"), (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logout successful",
  });
});

// ================= GET ALL COURSES =================
studentRoute.get("/courses", verifyToken("STUDENT"), async (req, res, next) => {
  try {
    const courses = await CourseTypeModel.find({ isCourseActive: true })
      .populate("instructor", "firstName lastName profileImageUrl")
      .select("-lectures.videoUrl");

    res.status(200).json({
      message: "Active courses fetched",
      payload: courses,
    });
  } catch (err) {
    next(err);
  }
});

// ================= GET SINGLE COURSE =================
studentRoute.get(
  "/courses/:courseId",
  verifyToken("STUDENT"),
  async (req, res, next) => {
    try {
      const { courseId } = req.params;

      const course = await CourseTypeModel.findById(courseId).populate(
        "instructor",
        "firstName lastName profileImageUrl",
      );

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!course.isCourseActive) {
        return res.status(403).json({ message: "Course not available" });
      }

      const enrollment = await EnrollmentModel.findOne({
        student: req.user.userId,
        course: courseId,
      });

      res.status(200).json({
        message: "Course fetched",
        payload: {
          course,
          enrollment: enrollment || null,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= ENROLL =================
studentRoute.post(
  "/courses/:courseId/enroll",
  verifyToken("STUDENT"),
  async (req, res, next) => {
    try {
      const { courseId } = req.params;

      const course = await CourseTypeModel.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!course.isCourseActive) {
        return res.status(403).json({
          message: "Cannot enroll in inactive course",
        });
      }

      const enrollment = await EnrollmentModel.create({
        student: req.user.userId,
        course: courseId,
      });

      await CourseTypeModel.findByIdAndUpdate(courseId, {
        $inc: { totalStudents: 1 },
      });

      res.status(201).json({
        message: "Enrolled successfully",
        payload: enrollment,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          message: "Already enrolled in this course",
        });
      }
      next(err);
    }
  },
);

// ================= MY COURSES =================
studentRoute.get(
  "/my-courses",
  verifyToken("STUDENT"),
  async (req, res, next) => {
    try {
      const enrollments = await EnrollmentModel.find({
        student: req.user.userId,
      }).populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

      res.status(200).json({
        message: "My courses fetched",
        payload: enrollments,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= PROGRESS =================
studentRoute.patch(
  "/courses/:courseId/lectures/:lectureId/progress",
  verifyToken("STUDENT"),
  async (req, res, next) => {
    try {
      const { courseId, lectureId } = req.params;

      const enrollment = await EnrollmentModel.findOne({
        student: req.user.userId,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }

      // fix ObjectId comparison
      const alreadyCompleted = enrollment.completedLectures.some(
        (id) => id.toString() === lectureId,
      );

      if (!alreadyCompleted) {
        enrollment.completedLectures.push(
          new mongoose.Types.ObjectId(lectureId),
        );

        const course = await CourseTypeModel.findById(courseId);
        const totalLectures = course.lectures.length || 1;

        enrollment.progressPercentage = Math.round(
          (enrollment.completedLectures.length / totalLectures) * 100,
        );

        enrollment.lastAccessedAt = new Date();

        await enrollment.save();
      }

      res.status(200).json({
        message: "Progress updated",
        payload: enrollment,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= REVIEW =================
studentRoute.put(
  "/courses/:courseId/reviews",
  verifyToken("STUDENT"),
  async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { rating, comment } = req.body;

      await ReviewModel.findOneAndUpdate(
        {
          course: courseId,
          student: req.user.userId,
        },
        { rating, comment },
        { upsert: true, new: true, runValidators: true },
      );

      const stats = await ReviewModel.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: "$course",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await CourseTypeModel.findByIdAndUpdate(courseId, {
          averageRating: Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].count,
        });
      }

      res.status(200).json({
        message: "Review submitted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
);
