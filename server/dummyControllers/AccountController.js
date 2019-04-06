import dotenv from 'dotenv';
import Account from '../dummyModels/Account';
import dummyData from '../utils/dummyData';

dotenv.config();

const { accounts } = dummyData;

const AccountController = {
  /**
   * @description Create a new account
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
  }
};

export default AccountController;
