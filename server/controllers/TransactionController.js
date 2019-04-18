import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Model from '../db';
import Mail from '../utils/Mail';
import { isEmpty } from '../validation/authValidation';
import { users } from './AuthController';
import { accounts } from './AccountController';

dotenv.config();
const { log } = console;

const transactions = new Model(`transactions`);

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

    const { balance, owner } = accountToCredit[0];
    const accountOwner = await users.select(['*'], [`id='${owner}'`]);
    const newBalance = parseFloat(balance) + parseFloat(creditAmount);
    const newTransaction = await transactions.create(
      ['type', 'accountNumber', 'owner', 'cashier', 'amount', 'oldBalance', 'newBalance'],
      [
        `'credit', ${accountNumber}, ${owner}, '${req.decoded.id}', ${parseFloat(
          creditAmount
        )}, ${balance}, ${newBalance}`
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
      accountToCredit[0]
    );
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => {
      if (err) {
        log(err);
      }
      log(info);
    });
    const data = {
      transactionId: newTransaction[0].id,
      accountNumber,
      amount: newTransaction[0].amount,
      cashier: newTransaction[0].cashier,
      transactionType: newTransaction[0].type,
      accountBalance: updatedAccount[0].balance
    };
    return res.status(200).json({
      status: 200,
      data: [data],
      message: 'Account credited successfully'
    });
  }

  /**
   * @description Credit an account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/transactions/<account-number>/credit
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

    const { balance, owner } = accountToDebit[0];

    if (debitAmount > balance) {
      return res.status(400).json({
        status: 400,
        error: `Insufficient funds, your account balance is ${balance}`
      });
    }

    const accountOwner = await users.select(['*'], [`id='${owner}'`]);

    const newTransaction = await transactions.create(
      ['type', 'accountNumber', 'owner', 'cashier', 'amount', 'oldBalance', 'newBalance'],
      [
        `'debit', ${accountNumber}, ${owner}, '${req.decoded.id}', ${parseFloat(
          debitAmount
        )}, ${balance}, ${balance - parseFloat(debitAmount)}`
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
      accountToDebit[0]
    );
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => err || info);
    const data = {
      transactionId: newTransaction[0].id,
      accountNumber,
      amount: newTransaction[0].amount,
      cashier: newTransaction[0].cashier,
      transactionType: newTransaction[0].type,
      accountBalance: updatedAccount[0].balance
    };
    return res.status(200).json({
      status: 200,
      data: [data],
      message: 'Account debited successfully'
    });
  }
}
