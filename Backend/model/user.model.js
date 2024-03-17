/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    pass: String,
    role: {
      type: String,
      enum: ['admin', 'regular user'],
      default: 'regular user',
    },
  },
  {
    versionKey: false,
  },
);

const UserModel = mongoose.model('users', userSchema);

module.exports = { UserModel };
