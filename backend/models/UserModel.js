import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "course",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});
// create schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      // name must be rerquired and print a custom msg if not
      required: [true, "first name is required"],
      minLength: 3,
    },
    lastName: {
      type: String,
      required: [true, "last name name is required"],
      minLength: 4,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already existed"],
    },
    password: {
      type: String,
      required: [true, "invalid password"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      required: [true, "{Value} is an invalid role"],
    },
    profileImageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollments: [enrollmentSchema],
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);
// create model and export
export const UserTypeModel = model("user", userSchema);