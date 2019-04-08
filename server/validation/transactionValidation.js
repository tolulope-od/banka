import { isEmpty } from './authValidation';

/**
 * @description Function to check that the input fields for transactions are properly fillerd
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next Call back function
 * @route POST /api/v1/accounts
 * @returns {Object} status code and error message properties
 * @access private
 */
const validateCreditTransaction = (req, res, next) => {
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
};

export { validateCreditTransaction };
