/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable eqeqeq */
const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const { TaskModel } = require('../model/task.model');
const { access } = require('../middlewares/access.middleware');

const TaskRouter = express.Router();
TaskRouter.use(express.json());

/**
 * @swagger
 * components:
 *  schemas:
 *      Task:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The auto-generaed id of the user
 *              title:
 *                  type: string
 *                  description: The task's title
 *              body:
 *                  type: string
 *                  description: The task's body
 *              status:
 *                  type: string
 *                  description: Status is among one of them 'to-do', 'in-progress', 'done'
 */

/**
 * @swagger
 * /task:
 *  get:
 *      summary: This will get all the task data from the database
 *      tags: [Tasks]
 *      responses:
 *          200:
 *              description: The list of all tasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          type : array
 *                          item:
 *                              $ref: "#/components/schemas/Task"
 *          400:
 *              description: Something went Wrong!
 */

// To get all tasks
TaskRouter.get('/', auth, access('regular user', 'admin'), async (req, res) => {
  const { status } = req.query;
  const { userID } = req.body;
  const { page } = req.query;

  console.log(status);
  try {
    if (status === 'to-do') {
      const limit = 10;
      const skipval = page * limit - limit;
      const limitval = page * limit;
      res.status(200).json({
        tasks: await TaskModel.find({ status: 'to-do' })
          .skip(skipval)
          .limit(limitval),
      });
    } else if (status === 'in-progress') {
      const limit = 10;
      const skipval = page * limit - limit;
      const limitval = page * limit;
      res.status(200).json({
        tasks: await TaskModel.find({ status: 'in-progress' })
          .skip(skipval)
          .limit(limitval),
      });
    } else if (status === 'done') {
      const limit = 10;
      const skipval = page * limit - limit;
      const limitval = page * limit;
      res.status(200).json({
        tasks: await TaskModel.find({ status: 'done' })
          .skip(skipval)
          .limit(limitval),
      });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (userID && page) {
        const limit = 10;
        const skipval = page * limit - limit;
        const limitval = page * limit;
        // eslint-disable-next-line object-shorthand
        const tasks = await TaskModel.find({ userID: userID })
          .skip(skipval)
          .limit(limitval);
        res.status(200).json({ tasks });
      } else if (page) {
        const limit = 10;
        const skipval = page * limit - limit;
        const limitval = page * limit;
        const tasks = await TaskModel.find().skip(skipval).limit(limitval);
        res.status(200).json({ tasks });
      } else {
        const limit = 10;
        const skipval = page * limit - limit;
        const limitval = page * limit;
        const tasks = await TaskModel.find().skip(skipval).limit(limitval);
        res.status(200).json({ tasks });
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

/**
 * @swagger
 * /task:
 *  post:
 *      summary: To post the details of new task into the database
 *      tags: [Tasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Task"
 *      responses:
 *          200:
 *              description: The list of all the Tasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          type : array
 *                          item:
 *                              $ref: "#/components/schemas/Task"
 *          500:
 *              description: Some server error!
 */

// Add new task
TaskRouter.post(
  '/',
  auth,
  access('admin', 'regular user'),
  async (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { title, body, status, username, userID } = req.body;
    try {
      const task = new TaskModel({
        title,
        body,
        status,
        username,
        userID,
      });
      await task.save();
      res.status(200).json({ msg: 'New task has been added' });
    } catch (error) {
      res.status(400).json({ error });
    }
  // eslint-disable-next-line comma-dangle
  }
);

/**
 * @swagger
 * /task/{id}:
 *  patch:
 *      summary: To update the details of new task into the database
 *      tags: [Tasks]
 *      parameters:
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The task id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Task"
 *      responses:
 *          200:
 *              description: The list of updated user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type : array
 *                          item:
 *                              $ref: "#/components/schemas/Task"
 *          400:
 *              description: The user is not found!
 *          500:
 *              description: Some server error!
 */

// update task
TaskRouter.patch('/:taskID', auth, access('admin'), async (req, res) => {
  const { taskID } = req.params;
  const payload = req.body;
  const userID = req.body.userID;
  try {
    const task = await TaskModel.findOne({ _id: taskID });
    if (userID == task.userID) {
      await TaskModel.findByIdAndUpdate(taskID, payload);
      res.status(200).json({ msg: 'Task has been updated' });
    } else {
      res.status(200).json({ msg: "You aren't allowed to modify others task" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

/**
 * @swagger
 * /task/{id}:
 *  delete:
 *      summary: To delete the details of task into the database
 *      tags: [Tasks]
 *      parameters:
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: The task id
 *      responses:
 *          200:
 *              description: The list of deletd users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type : array
 *                          item:
 *                              $ref: "#/components/schemas/Task"
 *          500:
 *              description: Some server error!
 */

// Delete task
TaskRouter.delete(
  '/:taskID',
  auth,
  access('regular user', 'admin'),
  async (req, res) => {
    const { taskID } = req.params;
    const { userID } = req.body;
    try {
      const task = await TaskModel.findOne({ _id: taskID });
      if (task.userID == userID) {
        await TaskModel.findByIdAndDelete(taskID);
        res.status(200).json({ msg: 'Task deleted successfully' });
      } else {
        res
          .status(200)
          .json({ msg: "You don't have access to delete others task" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
);
module.exports = { TaskRouter };
