"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = _interopRequireWildcard(require("mongoose"));function _interopRequireWildcard(e, t) {if ("function" == typeof WeakMap) var r = new WeakMap(),n = new WeakMap();return (_interopRequireWildcard = function (e, t) {if (!t && e && e.__esModule) return e;var o,i,f = { __proto__: null, default: e };if (null === e || "object" != typeof e && "function" != typeof e) return f;if (o = t ? n : r) {if (o.has(e)) return o.get(e);o.set(e, f);}for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);return f;})(e, t);}








const adminSchema = new _mongoose.Schema(
  {
    userId: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    permissions: {
      type: [String],
      default: ['manage_users', 'manage_slots', 'manage_requests', 'view_analytics']
    }
  },
  { timestamps: true }
);var _default = exports.default =

_mongoose.default.model('Admin', adminSchema);