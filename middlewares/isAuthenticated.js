/**
* Allow any authenticated user.
*/
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {

      var scheme = parts[0];
      var credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
        jwt.verify(token, req.app.get('config').JWT_SECRET, function (err, decoded) {
          if (err) {
            return res.status(401).json({ message: err.message });
          }
          req.user = decoded;
          next();
        });
      } else {
        return res.status(401).json({ message: 'Format is Authorization: Bearer [token]' });
      }
    } else {
      return res.status(401).json({ message: 'Format is Authorization: Bearer [token]' });
    }
  } else {
    return res.status(401).json({ message: 'No Authorization header was found' });
  }
};
