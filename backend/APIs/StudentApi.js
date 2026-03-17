import exp from "express";
import { register, authenticate } from "../services/authService.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserModel.js";
import { CourseTypeModel } from "../models/CourseModel.js";

export const studentRoute = exp.Router();

//Register user
studentRoute.post("/register", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  const newUserObj = await register({ ...userObj, role: "STUDENT" });
  res.status(201).json({ message: "user created", payload: newUserObj });
});

//Read all courses(protected route)
studentRoute.get("/courses", verifyToken("STUDENT"), async (req, res) => {
  //read courses of all authors which are active
  const courses = await CourseTypeModel.find({ isArticleActive: true });
  //send res
  res.status(200).json({ message: "all courses", payload: courses });
});

//Add comment to an article(protected route)
studentRoute.put("/articles", verifyToken("STUDENT"), async (req, res) => {
  //get comment obj from req
  const { user, articleId, comment } = req.body;
  //check user(req.user)
  console.log(req.user);
  if (user !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  //find artcleby id and update
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { comments: { user, comment } } },
    { new: true, runValidators: true },
  );

  //if article not found
  if (!articleWithComment) {
    return res.status(404).json({ message: "Article not found" });
  }
  //send res
  res.status(200).json({ message: "comment added successfully", payload: articleWithComment });
});