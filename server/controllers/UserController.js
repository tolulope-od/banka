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
}
