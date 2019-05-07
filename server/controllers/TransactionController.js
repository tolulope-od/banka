import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Debug from 'debug';
import Model from '../db';
import Mail from '../utils/Mail';
import { isEmpty } from '../validation/authValidation';
import { users } from './AuthController';

dotenv.config();

const debug = Debug('dev');
const transactions = new Model(`transactions`);
const accounts = new Model(`accounts`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD
  }
});

export default class TransactionController {
  /**
   * @description Credit an account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/transactions/<account-number>/credit
   * @returns {Object} status code, data and message properties
   * @access private Admin or staff only
   */
  static async creditAccount(req, res) {
    const { accountNumber } = req.params;
    const { creditAmount } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToCredit = await accounts.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    if (isEmpty(accountToCredit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    const { balance, owner, status } = accountToCredit[0];

    if (req.decoded.id === owner) {
      return res.status(401).json({
        status: 401,
        error: 'You are not allowed to carry out that action'
      });
    }

    if (status === 'dormant') {
      return res.status(400).json({
        status: 400,
        error: 'Account is dormant, please activate it to carry out a transaction'
      });
    }

    const accountOwner = await users.select(['*'], [`id='${owner}'`]);
    const newBalance = parseFloat(balance) + parseFloat(creditAmount);
    const newTransaction = await transactions.create(
      [
        'type',
        'accountNumber',
        'owner',
        'cashier',
        'cashierName',
        'amount',
        'oldBalance',
        'newBalance'
      ],
      [
        `'credit', ${accountNumber}, ${owner}, '${req.decoded.id}', '${req.decoded.firstName} ${
          req.decoded.lastName
        }', ${parseFloat(creditAmount)}, ${balance}, ${newBalance}`
      ]
    );

    // update the balance of the old account
    const updatedAccount = await accounts.update(
      [`balance=${newTransaction[0].newbalance}`],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    // send notification to account owner
    const emailNotif = new Mail(
      newTransaction[0],
      accountOwner[0],
      accountNumber,
      updatedAccount[0]
    );
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => {
      if (err) {
        debug(err);
      }
      debug(info);
    });
    const data = {
      transactionId: newTransaction[0].transactionid,
      accountNumber,
      amount: newTransaction[0].amount,
      cashier: newTransaction[0].cashier,
      transactionType: newTransaction[0].type,
      oldBalance: newTransaction[0].oldbalance,
      newBalance: newTransaction[0].newbalance,
      accountBalance: updatedAccount[0].balance
    };
    return res.status(200).json({
      status: 200,
      data: [data],
      message: 'Account credited successfully'
    });
  }

  /**
   * @description Debit an account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/transactions/<account-number>/debit
   * @returns {Object} status code, data and message properties
   * @access private Admin or staff only
   */
  static async debitAccount(req, res) {
    const { accountNumber } = req.params;
    const { debitAmount } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToDebit = await accounts.select(
      ['*'],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    if (isEmpty(accountToDebit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    const { balance, owner, status } = accountToDebit[0];

    if (req.decoded.id === owner) {
      return res.status(401).json({
        status: 401,
        error: 'You are not allowed to carry out that action'
      });
    }

    if (status === 'dormant') {
      return res.status(400).json({
        status: 400,
        error: 'Account is dormant, please activate it to carry out a transaction'
      });
    }

    if (debitAmount > balance) {
      return res.status(400).json({
        status: 400,
        error: `Insufficient funds, your account balance is ${balance}`
      });
    }

    const accountOwner = await users.select(['*'], [`id='${owner}'`]);

    const newTransaction = await transactions.create(
      [
        'type',
        'accountNumber',
        'owner',
        'cashier',
        'cashierName',
        'amount',
        'oldBalance',
        'newBalance'
      ],
      [
        `'debit', ${accountNumber}, ${owner}, '${req.decoded.id}', '${req.decoded.firstName} ${
          req.decoded.lastName
        }', ${parseFloat(debitAmount)}, ${balance}, ${balance - parseFloat(debitAmount)}`
      ]
    );

    // update the balance of the old account
    const updatedAccount = await accounts.update(
      [`balance=${newTransaction[0].newbalance}`],
      [`accountnumber=${parseInt(accountNumber, 10)}`]
    );

    // send notification to account owner
    const emailNotif = new Mail(
      newTransaction[0],
      accountOwner[0],
      accountNumber,
      updatedAccount[0]
    );
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => err || info);
    const data = {
      transactionId: newTransaction[0].transactionid,
      accountNumber,
      amount: newTransaction[0].amount,
      cashier: newTransaction[0].cashier,
      transactionType: newTransaction[0].type,
      oldBalance: newTransaction[0].oldbalance,
      newBalance: newTransaction[0].newbalance,
      accountBalance: updatedAccount[0].balance
    };
    return res.status(200).json({
      status: 200,
      data: [data],
      message: 'Account debited successfully'
    });
  }

  /**
   * @description View an account transaction
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/transactions/:transactionId
   * @returns {Object} status code, data and message properties
   * @access private Userr and Staff
   */
  static async getSpecificTransaction(req, res) {
    const { transactionId } = req.params;
    const { id, type } = req.decoded;
    if (type === 'client') {
      const userAccountTransaction = await transactions.select(
        ['*'],
        [`transactionid=${transactionId} AND owner=${id}`]
      );

      if (isEmpty(userAccountTransaction)) {
        return res.status(404).json({
          status: 404,
          error: 'Transaction does not exist'
        });
      }

      return res.status(200).json({
        status: 200,
        data: userAccountTransaction
      });
    }

    const userAccountTransaction = await transactions.select(
      ['*'],
      [`transactionid=${transactionId}`]
    );

    if (isEmpty(userAccountTransaction)) {
      return res.status(404).json({
        status: 404,
        error: 'Transaction does not exist'
      });
    }
    return res.status(200).json({
      status: 200,
      data: userAccountTransaction
    });
  }
}
