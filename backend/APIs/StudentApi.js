import express from "express";
import { register } from "../services/authService.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";

export const studentRoute = express.Router();

//Register user
studentRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "STUDENT" });
  res.status(201).json({ message: "user created", payload: newUserObj });
});

//Read all courses(protected route)
studentRoute.get("/courses", verifyToken("STUDENT"), async (req, res) => {
  //read courses of all authors which are active
  const courses = await CourseTypeModel.find({ isCourseActive: true });
  //send res
  res.status(200).json({ message: "all courses", payload: courses });
});

//Add review to a course(protected route)
studentRoute.put("/courses/reviews", verifyToken("STUDENT"), async (req, res) => {
  const { userId, courseId, rating, comment } = req.body;
  
  if (userId !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let updatedCourse = await CourseTypeModel.findOneAndUpdate(
    { _id: courseId, isCourseActive: true },
    { $push: { reviews: { user: userId, rating, comment } } },
    { new: true, runValidators: true },
  );

  if (!updatedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json({ message: "Review added successfully", payload: updatedCourse });
});
