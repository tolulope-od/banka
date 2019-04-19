/* eslint-disable no-useless-escape */
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
    // Regular expression to check for valid email address - emailregex.com
    const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!validEmail.test(userEmail)) {
      return res.status(400).json({
        status: 400,
        error: 'Please provide a valid email address'
      });
    }
    return next();
  }
}
