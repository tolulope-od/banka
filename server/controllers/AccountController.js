import dotenv from 'dotenv';
import { isEmpty } from '../validation/authValidation';
import Model from '../db';

dotenv.config();

export const accounts = new Model(`accounts`);
const transactions = new Model(`transactions`);

export default class AccountController {
  /**
   * @description Fetch all accounts
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/accounts
   * @returns {Object} status code, data and message properties
   * @access private
   */
  static async fetchAllAccounts(req, res) {
    if (req.decoded.type === 'staff' || req.decoded.isadmin) {
      if (isEmpty(req.query)) {
        const allAccounts = await accounts.selectAll(['*']);
        return res.status(200).json({
          status: 200,
          data: allAccounts
        });
      }
      const { status } = req.query;
      const activeAccounts = await accounts.select(['*'], [`status='${status}'`]);
      return res.status(200).json({
        status: 200,
        data: activeAccounts
      });
    }
    const userAccounts = await accounts.select(['*'], [`owneremail='${req.decoded.email}'`]);

    return res.status(200).json({
      status: 200,
      data: userAccounts
    });
  }

  /**
   * @description Get a single account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff and Client
   */
  static async getSingleAccount(req, res) {
    const { accountNumber } = req.params;
    if (req.decoded.type === 'staff') {
      const accountDetails = await accounts.select(
        ['*'],
        [`accountnumber=${parseInt(accountNumber, 10)}`]
      );
      if (isEmpty(accountDetails)) {
        return res.status(404).json({
          status: 404,
          error: 'Account not found'
        });
      }
      const {
        id,
        balance,
        owner,
        createdon,
        type,
        owneremail,
        status,
        ownername
      } = accountDetails[0];
      const data = {
        id,
        accountNumber,
        owner,
        balance,
        createdon,
        type,
        owneremail,
        status,
        ownername
      };
      return res.status(200).json({
        status: 200,
        data: [data]
      });
    }

    const userAccountDetails = await await accounts.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)} AND owner=${req.decoded.id}`]
    );
    if (isEmpty(userAccountDetails)) {
      return res.status(404).json({
        status: 404,
        error: 'Account not found'
      });
    }
    const {
      id,
      balance,
      owner,
      createdon,
      type,
      owneremail,
      status,
      ownername
    } = userAccountDetails[0];
    const data = {
      id,
      accountNumber,
      owner,
      balance,
      createdon,
      type,
      owneremail,
      status,
      ownername
    };
    return res.status(200).json({
      status: 200,
      data: [data]
    });
  }

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
        ['accountNumber', 'owner', 'ownerName', 'ownerEmail', 'type', 'status', 'balance'],
        [
          `${accountNumber}, ${id}, '${req.decoded.firstName} ${
            req.decoded.lastName
          }', '${email}', '${type}', 'active', 0.0`
        ]
      );
      const data = {
        accountNumber: newAccount[0].accountnumber,
        firstName,
        lastName,
        email,
        type: newAccount[0].type,
        openingBalance: newAccount[0].balance,
        newAccount: newAccount[0]
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
   * @route DELETE /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Admin only
   */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    if (req.decoded.type === 'staff' && req.decoded.isAdmin) {
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

  /**
   * @description Get an accounts transaction history
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route GET /api/v1/accounts/:accountNumber/transactions
   * @returns {Object} status code, data and message properties
   * @access private Staff and User
   */
  static async getTransactionHistory(req, res) {
    const { accountNumber } = req.params;
    const { id, type } = req.decoded;
    const selectedAccount = await accounts.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    if (isEmpty(selectedAccount)) {
      return res.status(404).json({
        status: 404,
        error: 'Account not found'
      });
    }

    if (type === 'client') {
      const accountTransactions = await transactions.select(
        ['*'],
        [`accountnumber=${parseInt(accountNumber, 10)} AND owner=${id}`]
      );

      return res.status(200).json({
        status: 200,
        data: accountTransactions
      });
    }
    const accountTransactions = await transactions.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    return res.status(200).json({
      status: 200,
      data: accountTransactions
    });
  }
}
