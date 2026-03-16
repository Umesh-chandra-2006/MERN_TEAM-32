import exp from "express";
import { register } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { CourseTypeModel } from "../models/CourseModel.js";

export const InstructorApp = exp.Router();

//Register author(public)
InstructorApp.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "INSTRUCTOR" });
  //send res
  res.status(201).json({ message: "authroe created", payload: newUserObj });
});

//Create course(protected route)
InstructorApp.post("/courses", verifyToken("INSTRUCTOR"), async (req, res) => {
  //get course from req
  let course = req.body;

  //create course document
  let newCourseDoc = new CourseTypeModel(course);
  //save
  let createdCourseDoc = await newCourseDoc.save();
  //send res
  res.status(201).json({ message: "course created", payload: createdCourseDoc });
});

InstructorApp.get("/hello",verifyToken("INSTRUCTOR"),async(req,res)=>{
    res.status(200).json({message:"hello"})
})