"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.roleMiddleware = exports.generateToken = exports.authMiddleware = void 0;var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}










const generateToken = (userId, email, role) => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return _jsonwebtoken.default.sign({ id: userId, email, role }, secret, {
    expiresIn: expiresIn
  });
};exports.generateToken = generateToken;

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};exports.authMiddleware = authMiddleware;

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};exports.roleMiddleware = roleMiddleware;