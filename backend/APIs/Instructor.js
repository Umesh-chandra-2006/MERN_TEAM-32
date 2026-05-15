import express from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";
import { processS3VideoToHLS, generatePresignedUploadUrl } from "../services/videoService.js";
import { videoQueue } from "../services/videoQueue.js";

export const instructorRouter = express.Router();

// Register instructor
instructorRouter.post("/users", async (req, res) => {
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "INSTRUCTOR" });
  res.status(201).json({ message: "instructor created", payload: newUserObj });
});

// Create/Update course (Save as Draft or Publish)
instructorRouter.post("/courses", verifyToken("INSTRUCTOR"), async (req, res) => {
  let { _id, ...courseData } = req.body;
  const instructorId = req.user.userId;
  courseData.instructor = instructorId;

  if (!courseData.thumbnailUrl) {
    courseData.thumbnailUrl = "https://placehold.co/600x400?text=Course+Thumbnail";
  }

  // If _id is provided, it's an update, otherwise it's a creation
  if (_id) {
    const updatedCourse = await CourseTypeModel.findOneAndUpdate(
      { _id: _id, instructor: instructorId },
      { $set: courseData },
      { new: true, runValidators: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }
    return res.status(200).json({ message: "course updated", payload: updatedCourse });
  } else {
    let newCourseDoc = new CourseTypeModel(courseData);
    let createdCourseDoc = await newCourseDoc.save();
    res.status(201).json({ message: "course created", payload: createdCourseDoc });
  }
});

// Get single course by ID (for editing)
instructorRouter.get("/courses/:courseId", verifyToken("INSTRUCTOR"), async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user.userId;
  
  const course = await CourseTypeModel.findOne({ _id: courseId, instructor: instructorId });
  if (!course) {
    return res.status(404).json({ message: "Course not found or unauthorized" });
  }
  res.status(200).json({ message: "course found", payload: course });
});

// Get courses by instructor
instructorRouter.get("/courses", verifyToken("INSTRUCTOR"), async (req, res) => {
  const instructorId = req.user.userId;
  const courses = await CourseTypeModel.find({ instructor: instructorId })
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "instructor courses", payload: courses });
});

// Get presigned URL for direct S3 upload
instructorRouter.get(
  "/courses/:courseId/lectures/:lectureId/upload-url",
  verifyToken("INSTRUCTOR"),
  async (req, res) => {
    const { courseId, lectureId } = req.params;
    const s3Key = `courses/${courseId}/lectures/${lectureId}/raw-video-${Date.now()}.mp4`;
    
    const uploadUrl = await generatePresignedUploadUrl(s3Key);
    res.status(200).json({ 
      message: "Presigned URL generated", 
      payload: { uploadUrl, s3Key } 
    });
  }
);

// Trigger video processing after frontend uploads to S3
instructorRouter.post(
  "/courses/:courseId/lectures/:lectureId/process-video",
  verifyToken("INSTRUCTOR"),
  async (req, res) => {
    const { courseId, lectureId } = req.params;
    const { s3Key } = req.body;

    if (!s3Key) {
      return res.status(400).json({ message: "s3Key is required" });
    }

    const s3KeyPrefix = `courses/${courseId}/lectures/${lectureId}/hls`;
    const instructorId = req.user.userId;

    // Update status to processing
    await CourseTypeModel.findOneAndUpdate(
      { _id: courseId, "lectures._id": lectureId, instructor: instructorId },
      { $set: { "lectures.$.processingStatus": "processing" } }
    );

    // Add to task queue for sequential processing
    videoQueue.add({
      s3Key,
      s3KeyPrefix,
      courseId,
      lectureId,
      instructorId
    });

    res.status(202).json({
      message: "Video added to processing queue",
      payload: { status: "processing" },
    });
  },
);

// New endpoint to poll processing status
instructorRouter.get(
  "/courses/:courseId/lectures/:lectureId/status",
  verifyToken("INSTRUCTOR"),
  async (req, res) => {
    const { courseId, lectureId } = req.params;
    const instructorId = req.user.userId;

    const course = await CourseTypeModel.findOne(
      { _id: courseId, "lectures._id": lectureId, instructor: instructorId },
      { "lectures.$": 1 }
    );

    if (!course || !course.lectures[0]) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ 
      message: "Status fetched", 
      payload: { 
        processingStatus: course.lectures[0].processingStatus,
        videoUrl: course.lectures[0].videoUrl 
      } 
    });
  }
);
