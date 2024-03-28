/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connection } = require('./config/db');
const { UserRouter } = require('./routes/user.routes');
const { TaskRouter } = require('./routes/task.routes');

require('dotenv').config();

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({ msg: 'Your kanban board api is working fine' });
});

app.use('/users', UserRouter);
app.use('/task', TaskRouter);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kanban Board',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log('connected to the DB');
    console.log(`Server is running at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
