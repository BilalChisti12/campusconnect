"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.disconnectDB = exports.connectDB = void 0;var _mongoose = _interopRequireDefault(require("mongoose"));
var _dotenv = _interopRequireDefault(require("dotenv"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

_dotenv.default.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-parking';

const connectDB = async () => {
  try {
    await _mongoose.default.connect(MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};exports.connectDB = connectDB;

const disconnectDB = async () => {
  try {
    await _mongoose.default.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error);
    process.exit(1);
  }
};exports.disconnectDB = disconnectDB;