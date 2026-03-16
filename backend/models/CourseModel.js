import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: String,
});

const lectureSchema = new Schema({
  title: String,
  videoUrl: String,
  duration: Number,
});

const CourseSchema = new Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: {
      type: String,
      required: true,
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

    lectures: [lectureSchema],

    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    progress: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        completedLectures: [Number],
      },
    ],

    reviews: [reviewSchema],

    averageRating: {
      type: Number,
      default: 0,
    },

    isCourseActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);

export const CourseTypeModel = model("course", CourseSchema);


