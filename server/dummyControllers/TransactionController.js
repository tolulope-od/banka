import Transaction from '../dummyModels/Transaction';
import dummyData from '../utils/dummyData';
import { isEmpty } from '../validation/authValidation';

const { transactions, accounts } = dummyData;

const TransactionController = {
  /**
   * @description Credit an account
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @route POST /api/v1/transactions/<account-number>/credit
   * @returns {Object} status code, data and message properties
   * @access private Admin or staff only
   */
  creditAccount(req, res) {
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
};

export default TransactionController;
