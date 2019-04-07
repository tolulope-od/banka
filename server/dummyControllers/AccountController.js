import dotenv from 'dotenv';
import Account from '../dummyModels/Account';
import dummyData from '../utils/dummyData';
import { isEmpty } from '../validation/authValidation';

dotenv.config();

const { accounts } = dummyData;

const AccountController = {
  /**
   * @description Fetch all accounts
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/accounts
   * @returns {Object} status code, data and message properties
   * @access private
   */
  fetchAllAccounts(req, res) {
    if (req.decoded.type === 'staff' || req.decoded.isAdmin) {
      return res.status(200).json({
        status: 200,
        data: accounts
      });
    }
    const userAccounts = accounts.filter(account => account.owner === req.decoded.id);
    if (userAccounts) {
      return res.status(200).json({
        status: 200,
        data: userAccounts
      });
    }
    return true;
  },

  /**
   * @description Create a new account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/accounts
   * @returns {Object} status code, data and message properties
   * @access private Client only
   */
  createAccount(req, res) {
    const { type } = req.body;
    const { id, firstName, lastName, email } = req.decoded;
    if (req.decoded.type === 'client') {
      const newAccount = new Account();
      const accountsLength = accounts.length;
      const lastID = accounts[accountsLength - 1].id;
      const newID = lastID + 1;
      newAccount.id = newID;
      newAccount.owner = id;
      newAccount.createdOn = new Date();
      newAccount.type = type;
      newAccount.balance = 0.0;
      newAccount.status = 'active';
      newAccount.accountNumber = Math.floor(Math.random() * 10 ** 10);

      accounts.push(newAccount);
      const data = {
        accountNumber: newAccount.accountNumber,
        firstName,
        lastName,
        email,
        type: newAccount.type,
        openingBalance: newAccount.balance
      };
      return res.status(201).json({
        status: 201,
        data,
        message: 'Account created successfully'
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'Only clients can create accounts'
    });
  },

  /**
   * @description Edit an account status
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route PATCH /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff only
   */
  editAccountStatus(req, res) {
    const { accountNumber } = req.params;
    const { status } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToEdit = accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );
    if (isEmpty(accountToEdit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    if (accountToEdit.status === status) {
      return res.status(409).json({
        status: 409,
        error: `Account is already ${status}`
      });
    }

    accountToEdit.status = status;
    const data = {
      accountNumber: accountToEdit.accountNumber,
      status,
      owner: accountToEdit.owner
    };
    return res.status(200).json({
      status: 200,
      data
    });
  },

  /**
   * @description Get a single account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff and Client
   */
  getSingleAccount(req, res) {
    const { accountNumber } = req.params;
    const accountToRetrieve = accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );
    if (isEmpty(accountToRetrieve)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }
    const { id, balance, owner, createdOn, type } = accountToRetrieve;
    const data = { id, accountNumber, owner, balance, createdOn, type };
    return res.status(200).json({
      status: 200,
      data
    });
  },

  /**
   * @description Delete a single account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route Get /api/v1/accounts/:accountNumber
   * @returns {Object} status code, data and message properties
   * @access private Staff only
   */
  deleteAccount(req, res) {
    const { accountNumber } = req.params;
    if (req.decoded.type === 'staff') {
      const accountToDelete = accounts.find(
        account => account.accountNumber === parseInt(accountNumber, 10)
      );
      if (isEmpty(accountToDelete)) {
        return res.status(404).json({
          status: 404,
          error: 'Account does not exist'
        });
      }
      const index = accounts.indexOf(accountToDelete);
      if (index > -1) {
        accounts.splice(index, 1);
        return res.status(200).json({
          status: 200,
          message: 'Account deleted successfully'
        });
      }
    }
    return res.status(401).json({
      status: 401,
      error: 'You are not authorized to delete an account'
    });
  }
};

export default AccountController;
