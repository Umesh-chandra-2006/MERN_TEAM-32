import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
        // References the ID of the lecture inside the course's lectures array
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique index: A student can only enroll in a course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
// Index for finding all courses a student is enrolled in
enrollmentSchema.index({ student: 1 });
// Index for finding all students in a specific course
enrollmentSchema.index({ course: 1 });

export const EnrollmentModel = model("enrollment", enrollmentSchema);
