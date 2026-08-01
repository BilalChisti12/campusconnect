"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updateSlot = exports.getAvailableSlots = exports.getAllSlots = exports.deleteSlot = exports.createSlot = void 0;
var _Slot = _interopRequireDefault(require("../models/Slot"));
var _Student = _interopRequireDefault(require("../models/Student"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// Get all parking slots with occupancy status
const getAllSlots = async (req, res) => {
  try {
    // Get all slots from database
    const slots = await _Slot.default.find().sort({ zone: 1, slotNumber: 1 });

    // Get all approved students with their slots
    const studentsWithSlots = await _Student.default.find({
      status: 'approved',
      slotId: { $exists: true, $ne: null }
    }).populate('userId', 'name');

    const slotAssignments = new Map();
    studentsWithSlots.forEach((student) => {
      slotAssignments.set(student.slotId, {
        studentName: student.userId?.name || 'Unknown',
        vehicleNumber: student.vehicleNumber
      });
    });

    const slotsWithStatus = slots.map((slot) => {
      const assignment = slotAssignments.get(slot.slotNumber);
      return {
        _id: slot._id,
        slotNumber: slot.slotNumber,
        zone: slot.zone,
        status: assignment ? 'occupied' : slot.status,
        assignedTo: assignment?.studentName || null,
        vehicleNumber: assignment?.vehicleNumber || null,
        createdAt: slot.createdAt
      };
    });

    res.json({
      success: true,
      data: slotsWithStatus
    });
  } catch (error) {
    console.error('Get all slots error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get available slots only
exports.getAllSlots = getAllSlots;const getAvailableSlots = async (req, res) => {
  try {
    // Get all slots that are currently assigned to approved students
    const occupiedSlots = await _Student.default.find({
      status: 'approved',
      slotId: { $exists: true, $ne: null }
    }).select('slotId');

    const occupiedSlotIds = occupiedSlots.map((s) => s.slotId);

    // Get all slots from database
    const allSlots = await _Slot.default.find().sort({ zone: 1, slotNumber: 1 });

    // Filter out occupied slots and maintenance slots
    const availableSlots = allSlots.filter((slot) =>
    !occupiedSlotIds.includes(slot.slotNumber) && slot.status === 'available'
    );

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new slot
exports.getAvailableSlots = getAvailableSlots;const createSlot = async (req, res) => {
  try {
    const { slotNumber, zone } = req.body;

    if (!slotNumber || !zone) {
      return res.status(400).json({
        success: false,
        message: 'Slot number and zone are required'
      });
    }

    const slot = await _Slot.default.create({
      slotNumber: slotNumber.toUpperCase(),
      zone,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      data: slot
    });
  } catch (error) {
    console.error('Create slot error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Slot '${req.body.slotNumber}' already exists`
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update slot
exports.createSlot = createSlot;const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slotNumber, zone, status } = req.body;

    const updateData = {};
    if (slotNumber) updateData.slotNumber = slotNumber.toUpperCase();
    if (zone) updateData.zone = zone;
    if (status) updateData.status = status;

    const slot = await _Slot.default.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    res.json({
      success: true,
      message: 'Slot updated successfully',
      data: slot
    });
  } catch (error) {
    console.error('Update slot error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Slot '${req.body.slotNumber}' already exists`
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete slot
exports.updateSlot = updateSlot;const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if slot is assigned to any student
    const slot = await _Slot.default.findById(id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    const assignedStudent = await _Student.default.findOne({ slotId: slot.slotNumber });
    if (assignedStudent) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete slot that is assigned to a student'
      });
    }

    await _Slot.default.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.deleteSlot = deleteSlot;