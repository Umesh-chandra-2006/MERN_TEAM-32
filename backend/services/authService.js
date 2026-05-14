
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import crypto from "crypto";
import {config} from 'dotenv'
config()

//register function
export const register = async (userObj) => {
  //Create document
  const userDoc = new UserTypeModel(userObj);
  //validate for emprty passwords
  await userDoc.validate();
  //hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  userDoc.passwordChangedAt = new Date();
  //save
  const created = await userDoc.save();
  //convert document to object to remove password
  const newUserObj = created.toObject();
  //remove password
  delete newUserObj.password;
  //return user obj without password
  return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password }) => {
    //check user with email & role
  const user = await UserTypeModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }
  //if user valid ,but blocked by admin

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
  //check isACtive state
   if (user.isActive===false) {
    const err = new Error("Your account blocked. Plz contact Admin");
    err.status = 403;
    throw err;
  }

  //generate token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Extended to 1 day since refresh token is removed
  );

  const userObj = user.toObject();
  delete userObj.password;

  return { accessToken, user: userObj };
};

export const createPasswordResetToken = async (email) => {
  const user = await UserTypeModel.findOne({ email });

  if (!user) {
    const err = new Error("No account found with this email");
    err.status = 404;
    throw err;
  }

  if (user.isActive === false) {
    const err = new Error("Your account blocked. Plz contact Admin");
    err.status = 403;
    throw err;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  return { resetToken, user };
};

export const resetPasswordWithToken = async (token, newPassword) => {
  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserTypeModel.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    const err = new Error("Invalid or expired reset token");
    err.status = 400;
    throw err;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.passwordChangedAt = new Date();
  await user.save();

  return user.toObject();
};
