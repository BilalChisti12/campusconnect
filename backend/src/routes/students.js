"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _studentController = require("../controllers/studentController");
var _auth = require("../middleware/auth");

const router = (0, _express.Router)();

// All routes require authentication
router.use(_auth.authMiddleware);

// Get current student's own profile (for logged-in student)
router.get('/me', (0, _auth.roleMiddleware)(['student']), _studentController.getMyProfile);

// Get all students (admin and security)
router.get('/', (0, _auth.roleMiddleware)(['admin', 'entrance_security', 'parking_security']), _studentController.getAllStudents);

// Get pending requests (admin only)
router.get('/pending', (0, _auth.roleMiddleware)(['admin']), _studentController.getPendingRequests);

// Get student statistics (admin only)
router.get('/stats', (0, _auth.roleMiddleware)(['admin']), _studentController.getStudentStats);

// Update student status (admin only)
router.patch('/:id/status', (0, _auth.roleMiddleware)(['admin']), _studentController.updateStudentStatus);var _default = exports.default =

router;