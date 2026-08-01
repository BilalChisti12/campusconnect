"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");
var _slotController = require("../controllers/slotController");






var _auth = require("../middleware/auth");

const router = (0, _express.Router)();

// All routes require authentication
router.use(_auth.authMiddleware);

// Get available slots (for admin when approving)
router.get('/available', (0, _auth.roleMiddleware)(['admin']), _slotController.getAvailableSlots);

// Get all slots with status (for admin slot management)
router.get('/', (0, _auth.roleMiddleware)(['admin']), _slotController.getAllSlots);

// Create new slot
router.post('/', (0, _auth.roleMiddleware)(['admin']), _slotController.createSlot);

// Update slot
router.patch('/:id', (0, _auth.roleMiddleware)(['admin']), _slotController.updateSlot);

// Delete slot
router.delete('/:id', (0, _auth.roleMiddleware)(['admin']), _slotController.deleteSlot);var _default = exports.default =

router;