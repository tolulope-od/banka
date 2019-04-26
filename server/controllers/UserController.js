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
   * @description Get a all accounts owned by a user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/users/:user-email-address/accounts
   * @returns {Object} status code, data and message properties
   * @access private Staff and Client
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
        return res.status(400).json({
          status: 400,
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
}
