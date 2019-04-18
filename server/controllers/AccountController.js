import dotenv from 'dotenv';
import { isEmpty } from '../validation/authValidation';
import Model from '../db';

dotenv.config();

export const accounts = new Model(`accounts`);

export default class AccountController {
  /**
   * @description Create a new account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/accounts
   * @returns {Object} status code, data and message properties
   * @access private Client only
   */
  static async createAccount(req, res) {
    const { type } = req.body;
    const { id, firstName, lastName, email } = req.decoded;
    if (req.decoded.type === 'client') {
      const accountNumber = Math.floor(Math.random() * 10 ** 10);
      const newAccount = await accounts.create(
        ['accountNumber', 'owner', 'ownerEmail', 'type', 'status', 'balance'],
        [`${accountNumber}, ${id}, '${email}', '${type}', 'active', 0.0`]
      );
      const data = {
        accountNumber: newAccount[0].accountnumber,
        firstName,
        lastName,
        email,
        type: newAccount[0].type,
        openingBalance: newAccount[0].balance
      };
      return res.status(201).json({
        status: 201,
        data: [data],
        message: 'Account created successfully'
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'Only clients can create accounts'
    });
  }

  /**
   * @description Edit an account status
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route PATCH /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff only
   */
  static async editAccountStatus(req, res) {
    const { accountNumber } = req.params;
    const { status } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToEdit = await accounts.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );
    if (isEmpty(accountToEdit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    if (accountToEdit[0].status === status) {
      return res.status(409).json({
        status: 409,
        error: `Account is already ${status}`
      });
    }

    accounts.update([`status='${status}'`], [`accountnumber=${parseInt(accountNumber, 10)}`]);
    const data = {
      accountNumber: accountToEdit[0].accountnumber,
      status,
      owner: accountToEdit[0].owner,
      ownerEmail: accountToEdit[0].owneremail
    };
    return res.status(200).json({
      status: 200,
      data: [data]
    });
  }

  /**
   * @description Delete a single account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff only
   */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    if (req.decoded.type === 'staff') {
      const accountToDelete = await accounts.select(
        ['*'],
        [`accountnumber=${parseInt(accountNumber, 10)}`]
      );
      if (isEmpty(accountToDelete)) {
        return res.status(404).json({
          status: 404,
          error: 'Account does not exist'
        });
      }
      await accounts.delete(['*'], [`accountnumber=${accountToDelete[0].accountnumber}`]);
      return res.status(200).json({
        status: 200,
        message: 'Account deleted successfully'
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'You are not authorized to delete an account'
    });
  }
}
