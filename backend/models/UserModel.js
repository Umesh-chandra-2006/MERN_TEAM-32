import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      minLength: 3,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexing for faster login lookups
userSchema.index({ email: 1 });

export const UserTypeModel = model("user", userSchema);
