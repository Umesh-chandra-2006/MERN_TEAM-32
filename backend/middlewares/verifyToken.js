import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserTypeModel } from "../models/UserModel.js";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Read token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please login" });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserTypeModel.findById(decodedToken.userId).select("passwordChangedAt isActive role");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized. Please login" });
      }

      if (user.isActive === false) {
        return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }

      if (user.passwordChangedAt) {
        const issuedAtMs = (decodedToken.iat || 0) * 1000;
        if (issuedAtMs < user.passwordChangedAt.getTime()) {
          return res.status(401).json({ message: "Session expired. Please login again" });
        }
      }

      // Check if role is allowed
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }

      // Attach user info to req for use in routes
      req.user = decodedToken;

      next();
    } catch (err) {
      // jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }
      next(err);
    }
  };
};