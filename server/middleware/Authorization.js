import jwt from 'jsonwebtoken';

const Authorization = {
  /**
   * @description method to protect routes and check for token in incoming requests
   * @param {Object} req The request object
   * @param {Object} res The resposnse object
   * @returns {Object} status code and message
   */
  checkToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers.authorization;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: 401,
            error: 'Token is invalid'
          });
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorized! You must be logged in for that'
      });
    }
  }
};

export default Authorization;
