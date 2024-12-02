const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No authorization token provided' 
      });
    }

    // Extract token from header
    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findOne({ 
      _id: decoded.id 
    }).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Attach user and token to request object
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid authentication token' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Authentication token has expired' 
      });
    }

    // Catch any other unexpected errors
    res.status(500).json({ 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
};

// Role-based authorization middleware
const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      // Check if user exists and has required role
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required' 
        });
      }

      // Check if user's role is in allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Access denied' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        message: 'Authorization error', 
        error: error.message 
      });
    }
  };
};

// Token refresh middleware
const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const user = req.user;

    // Generate new access token
    const newToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Optional: Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    req.newToken = newToken;
    req.refreshToken = refreshToken;

    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Token refresh failed', 
      error: error.message 
    });
  }
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  refreshTokenMiddleware
};