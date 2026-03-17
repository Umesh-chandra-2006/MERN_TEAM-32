import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique index: A student can only review a course once
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

export const ReviewModel = model("review", reviewSchema);
