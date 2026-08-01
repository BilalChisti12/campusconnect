"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireWildcard(require("mongoose"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}












const studentSchema = new _mongoose.Schema(
  {
    userId: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required']
    },
    vehicleType: {
      type: String,
      enum: ['two_wheeler', 'four_wheeler'],
      required: [true, 'Vehicle type is required']
    },
    slotId: String,
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

studentSchema.index({ userId: 1 });
studentSchema.index({ status: 1 });var _default = exports.default =

_mongoose.default.model('Student', studentSchema);