// middlewares/checkRole.js
const User = require("../models/User");

exports.checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userDetails = await User.findOne({ email: req.user.email });

      if (!userDetails || !allowedRoles.includes(userDetails.accountType)) {
        return res.status(401).json({
          success: false,
          message: `Access denied. This is a protected route for: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User Role can't be verified",
      });
    }
  };
};
