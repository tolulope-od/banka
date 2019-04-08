import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Transaction from '../dummyModels/Transaction';
import Mail from '../utils/Mail';
import dummyData from '../utils/dummyData';
import { isEmpty } from '../validation/authValidation';

dotenv.config();
const { log } = console;
const { transactions, accounts, users } = dummyData;

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
  static creditAccount(req, res) {
    const { accountNumber } = req.params;
    const { creditAmount } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToCredit = accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );

    if (isEmpty(accountToCredit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    const { balance, owner } = accountToCredit;
    const accountOwner = users.find(user => user.id === owner);
    const transactionsLastID = transactions[transactions.length - 1].id;
    const newID = transactionsLastID + 1;
    const transaction = new Transaction();

    transaction.id = newID;
    transaction.cashier = req.decoded.id;
    transaction.createdOn = new Date();
    transaction.type = 'credit';
    transaction.amount = parseFloat(creditAmount);
    transaction.accountNumber = accountNumber;
    transaction.owner = owner;
    transaction.oldBalance = balance;
    transaction.newBalance = balance + parseFloat(creditAmount);

    // update the balance of the old account
    accountToCredit.balance = transaction.newBalance;

    // send notification to account owner
    const emailNotif = new Mail(transaction, accountOwner, accountNumber, accountToCredit);
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => {
      if (err) {
        log(err);
      }
      log(info);
    });
    const data = {
      transactionId: transaction.id,
      accountNumber,
      amount: transaction.amount,
      cashier: transaction.cashier,
      transactionType: transaction.type,
      accountBalance: accountToCredit.balance
    };
    return res.status(201).json({
      status: 201,
      data,
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
  static debitAccount(req, res) {
    const { accountNumber } = req.params;
    const { debitAmount } = req.body;
    if (req.decoded.type !== 'staff') {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to carry out that action'
      });
    }
    const accountToDebit = accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );

    if (isEmpty(accountToDebit)) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist'
      });
    }

    const { balance, owner } = accountToDebit;

    if (debitAmount > balance) {
      return res.status(409).json({
        status: 409,
        error: `Insufficient funds, your account balance is ${balance}`
      });
    }

    const accountOwner = users.find(user => user.id === owner);
    const transactionsLastID = transactions[transactions.length - 1].id;
    const newID = transactionsLastID + 1;
    const transaction = new Transaction();

    transaction.id = newID;
    transaction.cashier = req.decoded.id;
    transaction.createdOn = new Date();
    transaction.type = 'debit';
    transaction.amount = parseFloat(debitAmount);
    transaction.accountNumber = accountNumber;
    transaction.owner = owner;
    transaction.oldBalance = balance;
    transaction.newBalance = balance - parseFloat(debitAmount);

    // update the balance of the old account
    accountToDebit.balance = transaction.newBalance;

    // send notification to account owner
    const emailNotif = new Mail(transaction, accountOwner, accountNumber, accountToDebit);
    transporter.sendMail(emailNotif.getMailOptions(), (err, info) => {
      if (err) {
        log(err);
      }
      log(info);
    });
    const data = {
      transactionId: transaction.id,
      accountNumber,
      amount: transaction.amount,
      cashier: transaction.cashier,
      transactionType: transaction.type,
      accountBalance: accountToDebit.balance
    };
    return res.status(201).json({
      status: 201,
      data,
      message: 'Account debited successfully'
    });
  }
}
