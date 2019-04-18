import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Model from '../db';

dotenv.config();

export const users = new Model(`users`);

export default class AuthController {
  /**
   * @description Register a new user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/auth/signup
   * @returns {Object} status code, data and message properties
   * @access public
   */
  static async signUp(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await users.select(['email'], [`email='${email}'`]);
    if (existingUser.length > 0) {
      return res.status(409).json({
        status: 409,
        error: 'User already exists'
      });
    }
    const hashed = bcrypt.hashSync(password, 10);
    const newUser = await users.create(
      ['firstName', 'lastName', 'email', 'password', 'isAdmin', 'type'],
      [`'${firstName}', '${lastName}', '${email}', '${hashed}', false, 'client'`]
    );
    const payload = {
      id: newUser[0].id,
      email: newUser[0].email,
      type: newUser[0].type,
      firstName: newUser[0].firstname,
      lastName: newUser[0].lastname,
      isAdmin: newUser[0].isadmin
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1hr' });
    const data = {
      token,
      id: newUser[0].id,
      firstName: newUser[0].firstname,
      lastName: newUser[0].lastname,
      email: newUser[0].email,
      type: newUser[0].type,
      createdAt: newUser[0].createdat
    };
    return res.status(201).json({
      status: 201,
      data: [data],
      message: 'User registered successfully'
    });
  }

  /**
   * @description Log In an existing user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/auth/signin
   * @returns {Object} status code, data and message properties
   * @access public
   */
  static async signIn(req, res) {
    const { email, password } = req.body;
    const findUser = await users.select(['*'], [`email='${email}'`]);
    if (findUser.length > 0) {
      const verifyPassword = bcrypt.compareSync(password, findUser[0].password);
      if (!verifyPassword) {
        return res.status(404).json({
          status: 404,
          error: 'Email or password is incorrect'
        });
      }
      const payload = {
        id: findUser[0].id,
        email: findUser[0].email,
        type: findUser[0].type,
        firstName: findUser[0].firstname,
        lastName: findUser[0].lastname,
        isAdmin: findUser[0].isadmin
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1hr' });

      const data = {
        token,
        id: findUser[0].id,
        firstName: findUser[0].firstname,
        lastName: findUser[0].lastname,
        email: findUser[0].email,
        type: findUser[0].type
      };
      return res.status(200).json({
        status: 200,
        data: [data],
        message: 'Login successful'
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'Email or password is incorrect'
    });
  }
}
