/* eslint-disable no-useless-escape */
/**
 * @description Function to check that input is not empty, undefined or null
 * @param {any} value The data type to be checked
 * @returns {Boolean}
 */
const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

export default class AuthValidation {
  /**
   * @description Function to check that the input fields for user registration are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/auth/signup
   * @returns {Object} status code and error message properties
   * @access public
   */
  static validateUserSignup(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    // Regular expression to check for valid email address - emailregex.com
    const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (isEmpty(firstName) && isEmpty(lastName) && isEmpty(email) && isEmpty(password)) {
      return res.status(400).json({
        status: 400,
        error: 'All fields are required'
      });
    }

    if (isEmpty(firstName)) {
      return res.status(400).json({
        status: 400,
        error: 'First name is required'
      });
    }

    if (isEmpty(lastName)) {
      return res.status(400).json({
        status: 400,
        error: 'Last name is required'
      });
    }

    if (isEmpty(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Email is required'
      });
    }

    if (!validEmail.test(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Please provide a valid email address'
      });
    }

    if (isEmpty(password)) {
      return res.status(400).json({
        status: 400,
        error: 'Password is required'
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        status: 400,
        error: 'Password must be at least 6 characters long'
      });
    }

    return next();
  }

  /**
   * @description Function to check that the input fields for user log in are properly fillerd
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/auth/signin
   * @returns {Object} status code and error message properties
   * @access public
   */
  static validateUserLogIn(req, res, next) {
    const { email, password } = req.body;

    if (isEmpty(email) && isEmpty(password)) {
      return res.status(400).json({
        status: 400,
        error: 'Email and password are required'
      });
    }

    if (isEmpty(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Email is required'
      });
    }

    if (isEmpty(password)) {
      return res.status(400).json({
        status: 400,
        error: 'Password is required'
      });
    }

    return next();
  }
}

export { isEmpty };
