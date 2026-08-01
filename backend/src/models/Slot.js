"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireWildcard(require("mongoose"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}









const SlotSchema = new _mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true
    },
    zone: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for frequent queries
SlotSchema.index({ status: 1, zone: 1 });var _default = exports.default =

_mongoose.default.model('Slot', SlotSchema);