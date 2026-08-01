"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updateStudentStatus = exports.getStudentStats = exports.getPendingRequests = exports.getMyProfile = exports.getAllStudents = void 0;
var _Student = _interopRequireDefault(require("../models/Student"));
var _User = _interopRequireDefault(require("../models/User"));
var _emailService = require("../services/emailService");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// Get all students with user data
const getAllStudents = async (req, res) => {
  try {
    const students = await _Student.default.find().
    populate('userId', 'name email phone department isActive').
    sort({ createdAt: -1 });

    const formattedStudents = students.map((s) => ({
      _id: s._id,
      name: s.userId?.name || 'Unknown',
      email: s.userId?.email || '',
      phone: s.userId?.phone || '',
      department: s.userId?.department || '',
      rollNumber: s.rollNumber,
      vehicleNumber: s.vehicleNumber,
      vehicleType: s.vehicleType,
      slotId: s.slotId,
      status: s.status,
      isActive: s.userId?.isActive ?? true,
      createdAt: s.createdAt
    }));

    res.json({
      success: true,
      data: formattedStudents
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get pending student requests
exports.getAllStudents = getAllStudents;const getPendingRequests = async (req, res) => {
  try {
    const students = await _Student.default.find({ status: 'pending' }).
    populate('userId', 'name email phone department').
    sort({ createdAt: -1 });

    const formattedRequests = students.map((s) => ({
      _id: s._id,
      studentName: s.userId?.name || 'Unknown',
      email: s.userId?.email || '',
      rollNumber: s.rollNumber,
      vehicleNumber: s.vehicleNumber,
      vehicleType: s.vehicleType,
      status: s.status,
      createdAt: s.createdAt
    }));

    res.json({
      success: true,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update student status (approve/reject)
exports.getPendingRequests = getPendingRequests;const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, slotId } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateData = { status };
    if (slotId) updateData.slotId = slotId;

    const student = await _Student.default.findByIdAndUpdate(id, updateData, { new: true });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Send approval email if status is approved
    if (status === 'approved' && slotId) {
      try {
        // Get student details with user info
        const studentWithUser = await _Student.default.findById(id).
        populate('userId', 'name email');

        if (studentWithUser) {
          const user = studentWithUser.userId;
          await (0, _emailService.sendParkingEmail)({
            to: user.email,
            name: user.name,
            email: user.email,
            password: '', // Not needed for approval email
            rollNumber: studentWithUser.rollNumber,
            vehicleNumber: studentWithUser.vehicleNumber,
            slotId: slotId,
            isApproved: true
          });
          console.log('✅ Approval email sent to:', user.email);
        }
      } catch (emailError) {
        console.error('❌ Failed to send approval email:', emailError);
        // Don't fail the approval if email fails
      }
    }

    res.json({
      success: true,
      message: `Student ${status} successfully`,
      data: student
    });
  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get student statistics
exports.updateStudentStatus = updateStudentStatus;const getStudentStats = async (req, res) => {
  try {
    const totalStudents = await _Student.default.countDocuments({ status: 'approved' });
    const pendingRequests = await _Student.default.countDocuments({ status: 'pending' });
    const twoWheelers = await _Student.default.countDocuments({ vehicleType: 'two_wheeler', status: 'approved' });
    const fourWheelers = await _Student.default.countDocuments({ vehicleType: 'four_wheeler', status: 'approved' });

    res.json({
      success: true,
      data: {
        totalStudents,
        pendingRequests,
        twoWheelers,
        fourWheelers
      }
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current logged-in student's profile
exports.getStudentStats = getStudentStats;const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // First get the user to check their role
    const user = await _User.default.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user is actually a student
    if (user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Access denied. Only students can access this endpoint.' });
    }

    // Try to find existing student profile
    let student = await _Student.default.findOne({ userId }).
    populate('userId', 'name email phone department isActive');

    // If no student profile exists, create one automatically
    if (!student) {
      console.log(`Creating student profile for user: ${user.email}`);

      // Generate default values based on user data
      const defaultRollNumber = `AUTO${Date.now().toString().slice(-6)}`;
      const defaultVehicleNumber = `TEMP${Date.now().toString().slice(-6)}`;

      student = await _Student.default.create({
        userId: user._id,
        rollNumber: defaultRollNumber,
        vehicleNumber: defaultVehicleNumber,
        vehicleType: 'two_wheeler',
        status: 'pending'
      });

      // Populate the user data after creation
      student = await _Student.default.findById(student._id).
      populate('userId', 'name email phone department isActive');
    }

    const formattedProfile = {
      id: student._id,
      userId: student.userId,
      name: student.userId?.name || 'Unknown',
      email: student.userId?.email || '',
      phone: student.userId?.phone || '',
      department: student.userId?.department || '',
      rollNumber: student.rollNumber,
      vehicleNumber: student.vehicleNumber,
      vehicleType: student.vehicleType,
      slotId: student.slotId,
      status: student.status,
      isActive: student.userId?.isActive ?? true,
      createdAt: student.createdAt
    };

    res.json({
      success: true,
      data: formattedProfile
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.getMyProfile = getMyProfile;