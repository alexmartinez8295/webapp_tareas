
const jwt = require('jsonwebtoken');

const jwtSecret = 'pruebaTokenAlxSites123456789ñ'; // Use the same secret as in auth.js

module.exports = function (req, res, next) {
  console.log('Auth middleware: Executing...');
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth middleware: Received token:', token ? 'Present' : 'Not Present');

  // Check if not token
  if (!token) {
    console.log('Auth middleware: No token found, sending 401.');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    
    next();
  } catch (err) {
    console.error('Auth middleware: Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
