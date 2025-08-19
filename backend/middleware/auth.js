// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Step 1: Check if header has "Authorization" and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Step 2: Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 3: Get user from token (without password)
      req.user = await User.findById(decoded.id).select('-password');

      // Step 4: Go to next middleware/route
      next();
    } catch (error) {
      console.log('Auth middleware error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // Step 5: If no token found
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };