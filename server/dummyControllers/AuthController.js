import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../dummyModels/User';
import dummyData from '../utils/dummyData';

dotenv.config();

const { users } = dummyData;

const AuthController = {
  /**
   * @description Register a new user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/auth/signup
   * @returns {Object} status code, data and message properties
   * @access public
   */
  signUp(req, res) {
    try {
      // eslint-disable-next-line no-unused-vars
      const { firstName, lastName, email, password, password2 } = req.body;
      const existingUser = users.some(user => user.email === email);
      if (!existingUser) {
        const newUser = new User();
        const usersLength = users.length;
        const lastID = users[usersLength - 1].id;
        const newID = lastID + 1;
        newUser.id = newID;
        newUser.firstName = firstName.trim();
        newUser.lastName = lastName.trim();
        newUser.email = email.trim();
        newUser.password = password.trim();
        newUser.type = 'staff';
        newUser.createdAt = new Date();

        users.push(newUser);
        const payload = { id: newUser.id, email: newUser.email };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1hr' });
        const data = {
          token,
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          type: newUser.type,
          createdAt: newUser.createdAt
        };
        return res.status(201).json({
          status: 201,
          data,
          message: 'User registered successfully'
        });
      }
      res.status(409).json({
        status: 409,
        error: 'User already exists'
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err.message
      });
    }

    return true;
  }
};

export default AuthController;
