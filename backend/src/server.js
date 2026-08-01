"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _database = require("./config/database");
var _auth = _interopRequireDefault(require("./routes/auth"));
var _users = _interopRequireDefault(require("./routes/users"));
var _students = _interopRequireDefault(require("./routes/students"));
var _slots = _interopRequireDefault(require("./routes/slots"));
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _logger = _interopRequireDefault(require("./utils/logger"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

_dotenv.default.config();

const app = (0, _express.default)();
const PORT = process.env.PORT || 5001;

// Middleware
app.use((0, _helmet.default)({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiter
const apiLimiter = (0, _expressRateLimit.default)({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// CORS Policy
const allowedOrigins = process.env.ALLOWED_ORIGIN 
  ? process.env.ALLOWED_ORIGIN.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080', 'http://localhost'];

app.use((0, _cors.default)({
  origin: function (origin, callback) {
    // In development or if origin is in the allowed list, allow it
    if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(_express.default.json());
app.use(_express.default.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  _logger.default.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Routes
app.use('/api/auth', _auth.default);
app.use('/api/users', _users.default);
app.use('/api/students', _students.default);
app.use('/api/slots', _slots.default);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(_express.default.static(_path.default.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(_path.default.join(__dirname, '../../frontend/dist/index.html'));
  });
} else {
  // 404 handler for development API
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  _logger.default.error('Unhandled Exception:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await (0, _database.connectDB)();

    const serverPort = Number(PORT) || 5001;

    app.listen(serverPort, '0.0.0.0', () => {
      _logger.default.info(`Server running on port ${serverPort} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    _logger.default.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();var _default = exports.default =

app;