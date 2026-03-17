import { Schema, model } from "mongoose";

const lectureSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    default: "",
  },
  duration: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  }
});

const CourseSchema = new Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    lectures: [lectureSchema],
    price: {
      type: Number,
      default: 0,
    },
    isCourseActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Denormalized fields for performance (read-heavy optimization)
    totalStudents: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for category-based filtering of active courses
CourseSchema.index({ category: 1, isCourseActive: 1 });
CourseSchema.index({ title: "text", description: "text" });

export const CourseTypeModel = model("course", CourseSchema);
