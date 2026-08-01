"use strict";var _database = require("../config/database");
var _User = _interopRequireDefault(require("../models/User"));
var _Student = _interopRequireDefault(require("../models/Student"));
var _Security = _interopRequireDefault(require("../models/Security"));
var _Admin = _interopRequireDefault(require("../models/Admin"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const seedAll = async () => {
  await (0, _database.connectDB)();

  try {
    // Clear existing data
    await _User.default.deleteMany({});
    await _Student.default.deleteMany({});
    await _Security.default.deleteMany({});
    await _Admin.default.deleteMany({});

    console.log('✓ Cleared existing data');

    // Create Admin
    const adminUser = await _User.default.create({
      name: 'Dr. Sharma',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210',
      department: 'Administration',
      isActive: true
    });

    await _Admin.default.create({
      userId: adminUser._id,
      permissions: ['manage_users', 'manage_slots', 'manage_requests', 'view_analytics', 'manage_violations', 'manage_students']
    });

    console.log('✓ Admin user created: admin@campus.edu / admin123');

    // Create Students
    const studentUsers = await _User.default.create([
    {
      name: 'Rahul Kumar',
      email: 'student@campus.edu',
      password: 'student123',
      role: 'student',
      phone: '+91-9123456789',
      department: 'Computer Science',
      isActive: true
    },
    {
      name: 'Priya Singh',
      email: 'priya@campus.edu',
      password: 'priya123',
      role: 'student',
      phone: '+91-9234567890',
      department: 'Electronics',
      isActive: true
    },
    {
      name: 'Arjun Patel',
      email: 'arjun@campus.edu',
      password: 'arjun123',
      role: 'student',
      phone: '+91-9345678901',
      department: 'Mechanical',
      isActive: true
    }]
    );

    // Create student profiles
    await _Student.default.create([
    {
      userId: studentUsers[0]._id,
      rollNumber: 'CS2024001',
      vehicleNumber: 'MH12AB1234',
      vehicleType: 'two_wheeler',
      status: 'approved'
    },
    {
      userId: studentUsers[1]._id,
      rollNumber: 'EC2024015',
      vehicleNumber: 'MH12CD5678',
      vehicleType: 'two_wheeler',
      status: 'pending'
    },
    {
      userId: studentUsers[2]._id,
      rollNumber: 'ME2024022',
      vehicleNumber: 'MH12EF9012',
      vehicleType: 'four_wheeler',
      status: 'approved'
    }]
    );

    console.log('✓ Created 3 student users with profiles');

    // Create Security Staff
    const entranceUser = await _User.default.create({
      name: 'Ramesh Kumar',
      email: 'entrance@campus.edu',
      password: 'entrance123',
      role: 'entrance_security',
      phone: '+91-9456789012',
      department: 'Security',
      isActive: true
    });

    await _Security.default.create({
      userId: entranceUser._id,
      designation: 'entrance_security',
      zone: 'Main Gate',
      badgeNumber: 'SEC001'
    });

    const parkingUser = await _User.default.create({
      name: 'Suresh Yadav',
      email: 'parking@campus.edu',
      password: 'parking123',
      role: 'parking_security',
      phone: '+91-9567890123',
      department: 'Security',
      isActive: true
    });

    await _Security.default.create({
      userId: parkingUser._id,
      designation: 'parking_security',
      zone: 'Zone A',
      badgeNumber: 'SEC002'
    });

    console.log('✓ Created 2 security staff users');

    console.log('\n=== Seeding Complete ===');
    console.log('Admin: admin@campus.edu / admin123');
    console.log('Entrance Security: entrance@campus.edu / entrance123');
    console.log('Parking Security: parking@campus.edu / parking123');
    console.log('Student: student@campus.edu / student123');
    console.log('Student: priya@campus.edu / priya123');
    console.log('Student: arjun@campus.edu / arjun123');

    await (0, _database.disconnectDB)();
  } catch (error) {
    console.error('✗ Error seeding data:', error);
    await (0, _database.disconnectDB)();
    process.exit(1);
  }
};

seedAll();