import express from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processVideoToHLS } from "../services/videoService.js";

export const InstructorApp = express.Router();

// Multer setup for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/raw/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Register instructor
InstructorApp.post("/users", async (req, res) => {
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "INSTRUCTOR" });
  res.status(201).json({ message: "instructor created", payload: newUserObj });
});

// Create course
InstructorApp.post("/courses", verifyToken("INSTRUCTOR"), async (req, res) => {
  let course = req.body;
  course.instructor = req.user.userId; // Securely set instructor from token

  let newCourseDoc = new CourseTypeModel(course);
  let createdCourseDoc = await newCourseDoc.save();
  res.status(201).json({ message: "course created", payload: createdCourseDoc });
});

// Get courses by instructor (Uses denormalized stats for speed)
InstructorApp.get("/courses", verifyToken("INSTRUCTOR"), async (req, res) => {
  const instructorId = req.user.userId;
  const courses = await CourseTypeModel.find({ instructor: instructorId })
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "instructor courses", payload: courses });
});

// Upload and transcode video for a lecture
InstructorApp.post(
  "/courses/:courseId/lectures/:lectureId/video",
  verifyToken("INSTRUCTOR"),
  upload.single("video"),
  async (req, res) => {
    const { courseId, lectureId } = req.params;
    const rawVideoPath = req.file.path;
    const outputDir = `uploads/hls/${courseId}/${lectureId}/`;
    const s3KeyPrefix = `courses/${courseId}/lectures/${lectureId}/hls`;

    try {
      const hlsUrl = await processVideoToHLS(rawVideoPath, outputDir, s3KeyPrefix);

      const updatedCourse = await CourseTypeModel.findOneAndUpdate(
        { _id: courseId, "lectures._id": lectureId, instructor: req.user.userId },
        { $set: { "lectures.$.videoUrl": hlsUrl } },
        { new: true },
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course or lecture not found" });
      }

      fs.unlinkSync(rawVideoPath);
      fs.rmSync(outputDir, { recursive: true, force: true });

      res.status(200).json({
        message: "Video uploaded successfully",
        payload: { hlsUrl },
      });
    } catch (err) {
      console.error("Video processing error: ", err);
      res.status(500).json({ message: "Video processing failed", error: err.message });
    }
  },
);
