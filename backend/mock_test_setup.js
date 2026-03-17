import mongoose from "mongoose";
import { UserTypeModel } from "./models/UserModel.js";
import { CourseTypeModel } from "./models/CourseModel.js";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: "./.env" });

async function setupMock() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB...");

    // 1. Create Mock Instructor
    const hashedPassword = await bcrypt.hash("password123", 10);
    const instructor = await UserTypeModel.findOneAndUpdate(
      { email: "mock_instructor@test.com" },
      {
        firstName: "Mock",
        lastName: "Instructor",
        email: "mock_instructor@test.com",
        password: hashedPassword,
        role: "INSTRUCTOR",
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log("Instructor Ready: ", instructor._id);

    // 2. Create Mock Course
    const course = await CourseTypeModel.findOneAndUpdate(
      { title: "Mock Test Course" },
      {
        instructor: instructor._id,
        title: "Mock Test Course",
        category: "Testing",
        description: "A course for testing video uploads.",
        lectures: [
          { title: "Introduction", duration: 120 }
        ],
        isCourseActive: true,
      },
      { upsert: true, new: true }
    );
    console.log("Course Ready: ", course._id);
    console.log("Lecture ID: ", course.lectures[0]._id);

    console.log("\n--- MOCK TEST DATA ---");
    console.log(`Instructor Email: mock_instructor@test.com`);
    console.log(`Course ID: ${course._id}`);
    console.log(`Lecture ID: ${course.lectures[0]._id}`);
    console.log("----------------------\n");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupMock();
