"use strict";var _database = require("../config/database");
var _User = _interopRequireDefault(require("../models/User"));
var _Admin = _interopRequireDefault(require("../models/Admin"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const seedAdmin = async () => {
  await (0, _database.connectDB)();

  try {
    // Check if admin already exists
    const existingAdmin = await _User.default.findOne({ email: 'admin@campus.edu', role: 'admin' });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      await (0, _database.disconnectDB)();
      return;
    }

    // Create admin user
    const adminUser = await _User.default.create({
      name: 'Dr. Sharma',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210',
      department: 'Administration',
      isActive: true
    });

    // Create admin profile
    await _Admin.default.create({
      userId: adminUser._id,
      permissions: ['manage_users', 'manage_slots', 'manage_requests', 'view_analytics', 'manage_violations', 'manage_students']
    });

    console.log('✓ Admin user seeded successfully');
    console.log(`  Email: admin@campus.edu`);
    console.log(`  Password: admin123`);
    console.log(`  ID: ${adminUser._id}`);

    await (0, _database.disconnectDB)();
  } catch (error) {
    console.error('✗ Error seeding admin:', error);
    await (0, _database.disconnectDB)();
    process.exit(1);
  }
};

seedAdmin();