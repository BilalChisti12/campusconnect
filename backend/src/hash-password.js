"use strict";var _bcryptjs = _interopRequireDefault(require("bcryptjs"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to hash');
  console.log('Usage: npm run hash <password>');
  process.exit(1);
}

const hashPassword = async (pwd) => {
  const salt = await _bcryptjs.default.genSalt(10);
  const hash = await _bcryptjs.default.hash(pwd, salt);
  console.log(`Password: ${pwd}`);
  console.log(`Hash: ${hash}`);
};

hashPassword(password);