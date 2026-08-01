"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.updateUser = exports.register = exports.login = exports.getProfile = exports.getAllUsers = exports.deleteUser = void 0;
var _User = _interopRequireDefault(require("../models/User"));

var _Student = _interopRequireDefault(require("../models/Student"));

var _auth = require("../middleware/auth");
var _emailService = require("../services/emailService");function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await _User.default.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account is inactive' });
    }

    const token = (0, _auth.generateToken)(user._id.toString(), user.email, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          department: user.department
        },
        expiresIn: '7d'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.login = login;

const getProfile = async (req, res) => {
  try {
    const { user } = req;

    const userData = await _User.default.findById(user.id);

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        department: userData.department
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.getProfile = getProfile;

const register = async (req, res) => {
  let user = null;

  try {
    const {
      name,
      email,
      password,
      role = 'student',
      phone,
      department,
      rollNumber,
      vehicleNumber,
      vehicleType = 'two_wheeler'
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await _User.default.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    if (role === 'student' && (!rollNumber || !vehicleNumber)) {
      return res.status(400).json({ success: false, message: 'Roll number and vehicle number are required for student registration' });
    }

    user = await _User.default.create({
      name,
      email,
      password,
      role,
      phone,
      department,
      isActive: true
    });

    let studentData = null;
    if (role === 'student') {
      try {
        studentData = await _Student.default.create({
          userId: user._id,
          rollNumber,
          vehicleNumber,
          vehicleType,
          status: 'pending'
        });

        // Send registration email to student
        try {
          await (0, _emailService.sendParkingEmail)({
            to: user.email,
            name: user.name,
            email: user.email,
            password: password,
            rollNumber: rollNumber,
            vehicleNumber: vehicleNumber,
            isApproved: false
          });
          console.log('✅ Registration email sent to:', user.email);
        } catch (emailError) {
          console.error('❌ Failed to send registration email:', emailError);
          // Don't fail registration if email fails
        }
      } catch (studentError) {
        // If student creation fails, delete the created user to maintain consistency
        await _User.default.findByIdAndDelete(user._id);

        // Check if it's a duplicate roll number error
        if (studentError.code === 11000) {
          const field = studentError.keyPattern ? Object.keys(studentError.keyPattern)[0] : 'field';
          const value = studentError.keyValue ? studentError.keyValue[field] : 'unknown';
          return res.status(409).json({
            success: false,
            message: `${field} '${value}' is already registered. Please use a different ${field}.`
          });
        }

        throw studentError; // Re-throw if it's not a duplicate error
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        student: studentData
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Check for duplicate key errors (for non-student roles or other errors)
    if (error.code === 11000) {
      const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'field';
      const value = error.keyValue ? error.keyValue[field] : 'unknown';
      return res.status(409).json({
        success: false,
        message: `${field} '${value}' is already registered. Please use a different ${field}.`
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.register = register;

const getAllUsers = async (req, res) => {
  try {
    const users = await _User.default.find({}).select('-password');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user
exports.getAllUsers = getAllUsers;const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, isActive, role } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (department !== undefined) updateData.department = department;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;

    const user = await _User.default.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete user
exports.updateUser = updateUser;const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await _User.default.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user is a student, delete their student record too
    if (user.role === 'student') {
      await _Student.default.findOneAndDelete({ userId: id });
    }

    await _User.default.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};exports.deleteUser = deleteUser;