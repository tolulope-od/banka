import { isEmpty } from './authValidation';

export default class AccountValidation {
  /**
   * @description Function to check that the input fields for account creation are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/accounts
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateAccountCreation(req, res, next) {
    const { type } = req.body;

    if (isEmpty(type)) {
      return res.status(400).json({
        status: 400,
        error: 'Account type is required'
      });
    }

    if (type !== 'savings' && type !== 'current') {
      return res.status(400).json({
        status: 400,
        error: 'Account type can only be either savings or current'
      });
    }

    return next();
  }

  /**
   * @description Function to check that the parameters for editing an account status are properly formatted
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route PATCH /api/v1/accounts
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateEditAccount(req, res, next) {
    const { accountNumber } = req.params;
    const { status } = req.body;
    const isNum = /^\d+$/; // gotten from Scott Evernden on Stack Overflow

    if (accountNumber.length !== 10) {
      return res.status(400).json({
        status: 400,
        error: 'Account number must be 10 digits'
      });
    }

    if (!isNum.test(accountNumber)) {
      return res.status(400).json({
        status: 400,
        error: 'Account number can only contain digits'
      });
    }

    if (isEmpty(status)) {
      return res.status(400).json({
        status: 400,
        error: 'Please specify a status, either active or dormant'
      });
    }

    if (status !== 'active' && status !== 'dormant' && status !== 'draft') {
      return res.status(400).json({
        status: 400,
        error: 'Status can only be active or dormant'
      });
    }

    return next();
  }

  /**
   * @description Function to check that the parameters for editing an account status are properly formatted
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route PATCH /api/v1/accounts
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateGetSingleAccount(req, res, next) {
    const { accountNumber } = req.params;
    const isNum = /^\d+$/; // gotten from Scott Evernden on Stack Overflow

    if (accountNumber.length !== 10) {
      return res.status(400).json({
        status: 400,
        error: 'Account number must be 10 digits'
      });
    }

    if (!isNum.test(accountNumber)) {
      return res.status(400).json({
        status: 400,
        error: 'Account number can only contain digits'
      });
    }

    return next();
  }
}
