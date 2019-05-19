const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({ email: email, isDeleted: false }, function (err, user) {
      // console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Invalid credentials.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid password.' });
      }
      return done(null, user);
    });
  }
));

const express = require('express');
const router = express.Router();
const ctrl = require('./controller');

router.route('/')
  .post(ctrl.login);

module.exports = router;