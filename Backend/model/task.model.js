/* eslint-disable linebreak-style */

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: String,
    body: String,
    status: {
      type: String,
      enum: ['to-do', 'in-progress', 'done'],
      default: 'to-do',
    },
    username: String,
    userID: String,
  },
  {
    versionKey: false,
  // eslint-disable-next-line comma-dangle
  }
);

const TaskModel = mongoose.model('task', taskSchema);

module.exports = { TaskModel };
