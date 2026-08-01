# Campus Connect Parking - Backend API

Node.js + Express + MongoDB backend for the Campus Connect Parking Management System.

## Setup

### 1. Install MongoDB
- **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/installation/)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Setup
Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-parking
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start MongoDB
```bash
# Windows - MongoDB Community Edition
mongod

# Mac/Linux
brew services start mongodb-community
# or
mongod
```

### 5. Seed Database
**Option A: Seed only admin user**
```bash
npm run seed
```

**Option B: Seed all sample data (Admin + Students + Security)**
```bash
npm run seed:all
```

### 6. Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "admin@campus.edu",
    "password": "admin123"
  }
  ```

- **GET** `/api/auth/profile` - Get user profile (requires token)

---

## Demo Credentials

After seeding, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Entrance Security | entrance@campus.edu | entrance123 |
| Parking Security | parking@campus.edu | parking123 |
| Student | student@campus.edu | student123 |
| Student | priya@campus.edu | priya123 |
| Student | arjun@campus.edu | arjun123 |

---

## Manually Add Users to MongoDB

In this version, passwords are stored in plain text in the `users` collection. This is extremely insecure and should only be used in development or demo mode.

### Step 1: Create User in MongoDB
Open `mongosh` and run:

```javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@campus.edu",
  password: "yourPassword123",
  role: "student",
  phone: "+91-9876543210",
  department: "Computer Science",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

  role: "student",
  phone: "+91-9876543210",
  department: "Computer Science",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Do NOT use the plain text password - always hash it first!

---

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'entrance_security' | 'parking_security' | 'admin',
  phone: String,
  department: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Students Collection
```javascript
{
  userId: ObjectId (ref: User),
  rollNumber: String (unique),
  vehicleNumber: String,
  vehicleType: 'two_wheeler' | 'four_wheeler',
  slotId: String,
  status: 'approved' | 'pending' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### Security Collection
```javascript
{
  userId: ObjectId (ref: User),
  designation: 'entrance_security' | 'parking_security',
  zone: String,
  badgeNumber: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection
```javascript
{
  userId: ObjectId (ref: User),
  permissions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run seed` - Seed admin user only
- `npm run seed:all` - Seed all sample data
- `npm run hash <password>` - Hash a password for direct MongoDB insertion

Examples:
```bash
npm run hash student123
npm run hash mySecurePassword123
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # MongoDB connection
│   ├── models/
│   │   ├── User.ts             # User schema
│   │   ├── Student.ts          # Student schema
│   │   ├── Security.ts         # Security staff schema
│   │   └── Admin.ts            # Admin schema
│   ├── controllers/
│   │   └── authController.ts   # Auth logic
│   ├── middleware/
│   │   └── auth.ts             # JWT auth middleware
│   ├── routes/
│   │   └── auth.ts             # Auth routes
│   ├── seeds/
│   │   ├── seedAdmin.ts        # Seed admin only
│   │   └── seedAll.ts          # Seed all data
│   ├── hash-password.ts        # Password hashing tool
│   └── server.ts               # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

---

## Next Steps

To connect the frontend to this backend:

1. Update [AuthContext.tsx](../src/contexts/AuthContext.tsx) to call `/api/auth/login`
2. Store JWT token from response
3. Send token in `Authorization: Bearer <token>` header for authenticated requests

---

## Troubleshooting

**Connection refused error**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`

**Port already in use**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

**Seed script fails**
- Ensure MongoDB is running
- Check connection string in `.env`

