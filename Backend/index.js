/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const { connection } = require('./config/db');
const { UserRouter } = require('./routes/user.routes');
const { TaskRouter } = require('./routes/task.routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({ msg: 'Your kanban board api is working fine' });
});

app.use('/user', UserRouter);
app.use('/task', TaskRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log('connected to the DB');
    console.log(`Server is running at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
