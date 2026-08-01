"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireWildcard(require("mongoose"));var _bcryptjs = _interopRequireDefault(require("bcryptjs"));function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}















const userSchema = new _mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['student', 'entrance_security', 'parking_security', 'admin'],
      required: [true, 'Role is required'],
      default: 'student',
      index: true
    },
    phone: String,
    department: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await _bcryptjs.default.genSalt(10);
    this.password = await _bcryptjs.default.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method using bcrypt
userSchema.methods.comparePassword = async function (password) {
  return await _bcryptjs.default.compare(password, this.password);
};var _default = exports.default =

_mongoose.default.model('User', userSchema);