import { isEmpty } from './authValidation';

export default class TransactionValidation {
  /**
   * @description Function to check that the input fields for transactions are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/transactions/<account-number>/credit
   *
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateCreditTransaction(req, res, next) {
    if (Object.keys(req.body).length > 1) {
      return res.status(400).json({
        status: 400,
        error: 'Only the credit amount is required'
      });
    }
    const { creditAmount } = req.body;

    if (isEmpty(creditAmount)) {
      return res.status(400).json({
        status: 400,
        error: 'Transaction amount cannot be empty'
      });
    }

    if (creditAmount < 1) {
      return res.status(400).json({
        status: 400,
        error: 'Credit transaction cannot be less than 1 Naira'
      });
    }

    if (!Number(creditAmount)) {
      return res.status(400).json({
        status: 400,
        error: 'Transactions can only contain digits'
      });
    }

    return next();
  }

  /**
   * @description Function to check that the input fields for transactions are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/transactions/<account-number>/debit
   *
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateDebitTransaction(req, res, next) {
    if (Object.keys(req.body).length > 1) {
      return res.status(400).json({
        status: 400,
        error: 'Only the debit amount is required'
      });
    }
    const { debitAmount } = req.body;

    if (isEmpty(debitAmount)) {
      return res.status(400).json({
        status: 400,
        error: 'Transaction amount cannot be empty'
      });
    }

    if (debitAmount < 1) {
      return res.status(400).json({
        status: 400,
        error: 'Debit transaction cannot be less than 1 Naira'
      });
    }

    if (!Number(debitAmount)) {
      return res.status(400).json({
        status: 400,
        error: 'Transactions can only contain digits'
      });
    }

    return next();
  }

  /**
   * @description Function to check that the input parameters for transactions are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route GET /api/v1/transactions/:transactionId
   *
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateGetSingleTransaction(req, res, next) {
    const { transactionId } = req.params;
    const isNum = /^\d+$/; // gotten from Scott Evernden on Stack Overflow
    if (!isNum.test(transactionId)) {
      return res.status(400).json({
        status: 400,
        error: 'Transaction ID can only contain digits'
      });
    }

    return next();
  }
}
