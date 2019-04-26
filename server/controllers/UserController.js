import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { accounts } from './AccountController';
import { users } from './AuthController';
import { isEmpty } from '../validation/authValidation';

export default class UserController {
  /**
   * @description Get a all accounts owned by a user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/users/:user-email-address/accounts
   * @returns {Object} status code, data and message properties
   * @access private Staff and Client
   */
  static async fetchAllAccountsByUser(req, res) {
    const { userEmail } = req.params;
    let userAccounts;
    if (req.decoded.type !== 'staff') {
      if (req.decoded.email !== userEmail) {
        return res.status(403).json({
          status: 403,
          error: 'You are not authorized to carry out that action'
        });
      }
      userAccounts = await accounts.select(['*'], [`owneremail='${userEmail}'`]);
      return res.status(200).json({
        status: 200,
        data: userAccounts
      });
    }
    const doesUserExist = await users.select(['email'], [`email='${userEmail}'`]);
    if (isEmpty(doesUserExist)) {
      return res.status(404).json({
        status: 404,
        error: 'User not found'
      });
    }

    userAccounts = await accounts.select(['*'], [`owneremail='${doesUserExist[0].email}'`]);
    return res.status(200).json({
      status: 200,
      data: userAccounts
    });
  }

  /**
   * @description Upgrade a client to a staff
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route PATCH /api/v1/users/
   * @returns {Object} status code, data and message properties
   * @access private Admin
   */
  static async adminAddStaff(req, res) {
    if (req.decoded.isAdmin) {
      const { userEmail } = req.body;
      const findUser = await users.select(['*'], [`email='${userEmail}'`]);

      if (isEmpty(findUser)) {
        return res.status(404).json({
          status: 404,
          error: 'User not found'
        });
      }
      const { type, isAdmin } = findUser[0];
      if (type === 'staff' || isAdmin) {
        return res.status(409).json({
          status: 409,
          error: 'User is already a staff'
        });
      }

      const updatedUser = await users.update([`type='staff'`], [`email='${userEmail}'`]);
      return res.status(200).json({
        status: 200,
        data: updatedUser,
        message: 'User is now a staff'
      });
    }

    return res.status(403).json({
      status: 403,
      error: 'You are not allowed to carry out that action'
    });
  }

  /**
   * @description Create a staff
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/users/
   * @returns {Object} status code, data and message properties
   * @access private Admin
   */
  static async createStaff(req, res) {
    if (req.decoded.isAdmin) {
      const { firstName, lastName, email, admin } = req.body;
      const existingUser = await users.select(['email'], [`email='${email}'`]);
      if (existingUser.length > 0) {
        return res.status(409).json({
          status: 409,
          error: 'Staff already exists'
        });
      }
      let isAdmin = true;
      if (isEmpty(admin)) {
        isAdmin = false;
      }
      const hashed = bcrypt.hashSync(lastName, 10);
      const newUser = await users.create(
        ['firstName', 'lastName', 'email', 'password', 'isAdmin', 'type'],
        [`'${firstName}', '${lastName}', '${email}', '${hashed}', ${isAdmin}, 'staff'`]
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
        isAdmin: newUser[0].isadmin,
        createdAt: newUser[0].createdat
      };
      return res.status(201).json({
        status: 201,
        data: [data],
        message: 'Staff created successfully'
      });
    }

    return res.status(401).json({
      status: 401,
      error: 'You are not allowed to carry out that action'
    });
  }
}
