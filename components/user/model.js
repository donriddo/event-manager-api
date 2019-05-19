const mongoose = require('mongoose');
const genericPlugin = require('../../helpers/generic-plugin');
const userPlugin = require('./plugin');

mongoose.Promise = require('bluebird');

const user = new mongoose.Schema({
  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  verificationHash: { type: String },

  emailVerified: { type: Boolean, default: false },

});

user.plugin(genericPlugin);

user.plugin(userPlugin);

module.exports = mongoose.model('user', user);
