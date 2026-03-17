import exp from "express";
import multer from "multer";
import fs from "fs";
import mongoose from "mongoose";

import { register, authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import { processVideoToHLS } from "../services/videoService.js";

export const InstructorApp = exp.Router();

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "uploads/raw/";
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ================= REGISTER =================
InstructorApp.post("/users", async (req, res, next) => {
  try {
    const newUser = await register({
      ...req.body,
      role: "INSTRUCTOR",
    });

    res.status(201).json({
      message: "Instructor created successfully",
      payload: newUser,
    });
  } catch (err) {
    next(err);
  }
});

// ================= LOGIN =================
InstructorApp.post("/login", async (req, res, next) => {
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
InstructorApp.post("/logout", verifyToken("INSTRUCTOR"), (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// ================= CREATE COURSE =================
InstructorApp.post(
  "/courses",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user.userId,
      };

      const newCourse = await CourseTypeModel.create(courseData);

      res.status(201).json({
        message: "Course created successfully",
        payload: newCourse,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= GET COURSES =================
InstructorApp.get(
  "/courses",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const courses = await CourseTypeModel.find({
        instructor: req.user.userId,
      }).sort({ createdAt: -1 });

      res.status(200).json({
        message: "Instructor courses fetched",
        payload: courses,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= UPDATE COURSE =================
InstructorApp.put(
  "/courses/:courseId",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const { courseId } = req.params;

      const course = await CourseTypeModel.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!course.isCourseActive) {
        return res.status(400).json({ message: "Course is inactive" });
      }

      const updatedCourse = await CourseTypeModel.findByIdAndUpdate(
        courseId,
        req.body,
        { new: true },
      );

      res.status(200).json({
        message: "Course updated successfully",
        payload: updatedCourse,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= ADD LECTURE =================
InstructorApp.post(
  "/courses/:courseId/lectures",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const course = await CourseTypeModel.findById(req.params.courseId);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!course.isCourseActive) {
        return res.status(400).json({ message: "Course inactive" });
      }

      course.lectures.push(req.body);
      await course.save();

      res.status(200).json({
        message: "Lecture added successfully",
        payload: course,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= UPLOAD VIDEO =================
InstructorApp.post(
  "/courses/:courseId/lectures/:lectureId/video",
  verifyToken("INSTRUCTOR"),
  upload.single("video"),
  async (req, res, next) => {
    try {
      const { courseId, lectureId } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const rawPath = req.file.path;
      const outputDir = `uploads/hls/${courseId}/${lectureId}/`;
      const s3KeyPrefix = `courses/${courseId}/lectures/${lectureId}/hls`;

      const hlsUrl = await processVideoToHLS(rawPath, outputDir, s3KeyPrefix);

      const updatedCourse = await CourseTypeModel.findOneAndUpdate(
        {
          _id: courseId,
          instructor: req.user.userId,
          "lectures._id": new mongoose.Types.ObjectId(lectureId),
        },
        { $set: { "lectures.$.videoUrl": hlsUrl } },
        { new: true },
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Lecture not found" });
      }

      // cleanup
      if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
      if (fs.existsSync(outputDir))
        fs.rmSync(outputDir, { recursive: true, force: true });

      res.status(200).json({
        message: "Video uploaded successfully",
        payload: { hlsUrl },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= COURSE STATUS =================
InstructorApp.patch(
  "/courses/:courseId/status",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const course = await CourseTypeModel.findById(req.params.courseId);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      course.isCourseActive = req.body.isCourseActive;
      await course.save();

      res.status(200).json({
        message: "Course status updated",
        payload: course,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ================= DELETE COURSE =================
InstructorApp.delete(
  "/courses/:courseId",
  verifyToken("INSTRUCTOR"),
  async (req, res, next) => {
    try {
      const course = await CourseTypeModel.findById(req.params.courseId);

      if (!course) return res.status(404).json({ message: "Course not found" });

      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await CourseTypeModel.findByIdAndDelete(req.params.courseId);

      res.status(200).json({
        message: "Course deleted permanently",
      });
    } catch (err) {
      next(err);
    }
  },
);
