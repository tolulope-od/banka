/* eslint-disable no-useless-escape */
import { isEmpty } from './authValidation';
// Regular expression to check for valid email address - emailregex.com
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default class UserValidation {
  /**
   * @description Function to check params when fetching a users accounts
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route GET /api/v1/user/:userEmail/accounts
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateFetchUsersAccounts(req, res, next) {
    const { userEmail } = req.params;
    if (!validEmail.test(userEmail)) {
      return res.status(400).json({
        status: 400,
        error: 'Please provide a valid email address'
      });
    }
    return next();
  }

  /**
   * @description Function to check params when upgrading a user to a staff
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route PATCH /api/v1/users
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateAddStaff(req, res, next) {
    const { userEmail } = req.body;
    if (Object.keys(req.body).length > 1) {
      return res.status(400).json({
        status: 400,
        error: 'Only the user email is required'
      });
    }

    if (isEmpty(userEmail)) {
      return res.status(400).json({
        status: 400,
        error: 'User email is required'
      });
    }

    if (!validEmail.test(userEmail)) {
      return res.status(400).json({
        status: 400,
        error: 'Please provide a valid email address'
      });
    }

    return next();
  }

  /**
   * @description Function to check params when creating a staff
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next Call back function
   * @route POST /api/v1/users
   * @returns {Object} status code and error message properties
   * @access private
   */
  static validateCreateStaff(req, res, next) {
    const { firstName, lastName, email, admin } = req.body;
    const containsAlphabets = /^[a-zA-Z ]*$/; // Gotten from Petar Ivanov on https://stackoverflow.com/questions/9289451/regular-expression-for-alphabets-with-spaces

    if (isEmpty(firstName) && isEmpty(lastName) && isEmpty(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Please enter all required fields'
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

    if (!containsAlphabets.test(firstName)) {
      return res.status(400).json({
        status: 400,
        error: 'First name can only contain alphabets'
      });
    }

    if (!containsAlphabets.test(lastName)) {
      return res.status(400).json({
        status: 400,
        error: 'Last name can only contain alphabets'
      });
    }

    if (!isEmpty(admin) && typeof admin !== 'boolean') {
      return res.status(400).json({
        status: 400,
        error: 'Please specify true or false for admin'
      });
    }

    return next();
  }
}
