"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _authController = require("../controllers/authController");
var _auth = require("../middleware/auth");

const router = (0, _express.Router)();

// Open registration for new users from frontend form (entrance-security) and optionally admin
router.post('/', _auth.authMiddleware, (0, _auth.roleMiddleware)(['admin', 'entrance_security']), _authController.register);

// Admin view all users
router.get('/', _auth.authMiddleware, (0, _auth.roleMiddleware)(['admin']), _authController.getAllUsers);

// Admin update user
router.patch('/:id', _auth.authMiddleware, (0, _auth.roleMiddleware)(['admin']), _authController.updateUser);

// Admin delete user
router.delete('/:id', _auth.authMiddleware, (0, _auth.roleMiddleware)(['admin']), _authController.deleteUser);var _default = exports.default =

router;