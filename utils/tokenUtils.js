const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate random token
exports.generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash token
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
