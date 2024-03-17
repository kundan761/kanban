/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const { blacklist } = require('../blacklist');
const { UserModel } = require('../model/user.model');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (blacklist.includes(token)) {
      res.status(200).json({ msg: 'Please login again' });
    } else {
      jwt.verify(token, 'masai', async (err, decoded) => {
        if (decoded) {
          const { userID } = decoded;
          const user = await UserModel.findOne({ _id: userID });
          console.log(user);
          req.body.userID = user._id;
          req.body.username = user.username;
          req.body.role = user.role;
          next();
        } else {
          res.json({ err });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = { auth };
