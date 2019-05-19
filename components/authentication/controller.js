const passport = require('passport');
const jwt = require('jsonwebtoken');
module.exports = {
  login: function (req, res) {
    if (!req.body.email || !req.body.password) return res.status(400).json({ message: 'email/password missing' });
    passport.authenticate('local', function (err, user, info) {
      if (err) return res.status(401).json(err);
      if (!user) return res.status(401).json(info);
      let token = jwt.sign(
        user.toJSON(), req.app.get('config').JWT_SECRET,
        { expiresIn: req.app.get('config').TOKEN_EXPIRY }
      );

      jwt.verify(token, req.app.get('config').JWT_SECRET, function (err, decoded) {
        req.user = user;
        return res.status(200).json({ user: decoded, token: token, expiry: decoded.exp });
      });

    })(req, res);
  }
}
