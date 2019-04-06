import { isEmpty } from './authValidation';

/**
 * @description Function to check that the input fields for account creation are properly fillerd
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next Call back function
 * @route POST /api/v1/accounts
 * @returns {Object} status code and error message properties
 * @access public
 */
const validateAccountCreation = (req, res, next) => {
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
};

export default validateAccountCreation;
