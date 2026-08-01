




































































export const zones = [
{ id: 'z1', name: 'Zone A - Main Building', totalSlots: 50 },
{ id: 'z2', name: 'Zone B - Library', totalSlots: 30 },
{ id: 'z3', name: 'Zone C - Sports Complex', totalSlots: 20 },
{ id: 'z4', name: 'Zone D - Hostel Area', totalSlots: 40 }];


export const parkingSlots = [
{ id: 's1', slotNumber: 'A-01', zone: 'Zone A', status: 'occupied', assignedTo: 'Rahul Kumar' },
{ id: 's2', slotNumber: 'A-02', zone: 'Zone A', status: 'available', assignedTo: null },
{ id: 's3', slotNumber: 'A-03', zone: 'Zone A', status: 'reserved', assignedTo: 'Priya Mehta' },
{ id: 's4', slotNumber: 'B-01', zone: 'Zone B', status: 'occupied', assignedTo: 'Arjun Reddy' },
{ id: 's5', slotNumber: 'B-02', zone: 'Zone B', status: 'available', assignedTo: null },
{ id: 's6', slotNumber: 'C-01', zone: 'Zone C', status: 'available', assignedTo: null },
{ id: 's7', slotNumber: 'C-02', zone: 'Zone C', status: 'occupied', assignedTo: 'Sneha Das' },
{ id: 's8', slotNumber: 'D-01', zone: 'Zone D', status: 'available', assignedTo: null },
{ id: 's9', slotNumber: 'D-02', zone: 'Zone D', status: 'reserved', assignedTo: 'Karan Joshi' },
{ id: 's10', slotNumber: 'D-03', zone: 'Zone D', status: 'occupied', assignedTo: 'Neha Gupta' }];


export const students = [
{ id: '1', name: 'Rahul Kumar', rollNumber: 'CS2021001', email: 'rahul@campus.edu', vehicleNumber: 'KA-01-AB-1234', vehicleType: 'Two Wheeler', slotId: 's1', status: 'approved' },
{ id: '2', name: 'Priya Mehta', rollNumber: 'EC2021015', email: 'priya@campus.edu', vehicleNumber: 'KA-02-CD-5678', vehicleType: 'Four Wheeler', slotId: 's3', status: 'approved' },
{ id: '3', name: 'Arjun Reddy', rollNumber: 'ME2022008', email: 'arjun@campus.edu', vehicleNumber: 'KA-03-EF-9012', vehicleType: 'Two Wheeler', slotId: 's4', status: 'approved' },
{ id: '4', name: 'Sneha Das', rollNumber: 'IT2021022', email: 'sneha@campus.edu', vehicleNumber: 'KA-04-GH-3456', vehicleType: 'Two Wheeler', slotId: 's7', status: 'approved' }];


export const entryLogs = [
{ id: 'e1', studentId: '1', studentName: 'Rahul Kumar', vehicleNumber: 'KA-01-AB-1234', type: 'entry', verifiedBy: 'Amit Singh', timestamp: '2024-01-15 08:30:00', method: 'sticker' },
{ id: 'e2', studentId: '2', studentName: 'Priya Mehta', vehicleNumber: 'KA-02-CD-5678', type: 'entry', verifiedBy: 'Amit Singh', timestamp: '2024-01-15 09:15:00', method: 'sticker' },
{ id: 'e3', studentId: '1', studentName: 'Rahul Kumar', vehicleNumber: 'KA-01-AB-1234', type: 'exit', verifiedBy: 'Amit Singh', timestamp: '2024-01-15 17:00:00', method: 'sticker' }];


export const visitorLogs = [
{ id: 'v1', name: 'Mr. Sharma', phone: '9876543210', vehicleNumber: 'KA-05-IJ-7890', purpose: 'Parent Visit', entryTime: '2024-01-15 10:00:00', exitTime: '2024-01-15 12:30:00', status: 'exited' },
{ id: 'v2', name: 'Delivery Person', phone: '9123456789', vehicleNumber: 'KA-06-KL-1234', purpose: 'Package Delivery', entryTime: '2024-01-15 11:00:00', exitTime: null, status: 'inside' }];


export const parkingRequests = [
{ id: 'r1', studentName: 'Amit Verma', rollNumber: 'CS2023005', vehicleNumber: 'KA-07-MN-5678', email: 'amit.v@campus.edu', status: 'pending', createdAt: '2024-01-14' },
{ id: 'r2', studentName: 'Riya Kapoor', rollNumber: 'EC2023012', vehicleNumber: 'KA-08-OP-9012', email: 'riya.k@campus.edu', status: 'pending', createdAt: '2024-01-13' }];


export const violations = [
{ id: 'vl1', slotId: 'A-05', vehicleNumber: 'KA-09-QR-3456', reportedBy: 'Vijay Patel', remarks: 'Unauthorized parking in reserved slot', imageUrl: null, timestamp: '2024-01-15 14:30:00', fine: 500, status: 'fined' },
{ id: 'vl2', slotId: 'B-03', vehicleNumber: 'KA-10-ST-7890', reportedBy: 'Vijay Patel', remarks: 'Double parking blocking adjacent slot', imageUrl: null, timestamp: '2024-01-15 16:00:00', fine: null, status: 'reported' }];