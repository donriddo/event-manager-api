const validator = require('validator');
const bcrypt = require('bcrypt');
module.exports = exports = function verificationHashPlugin(schema, options) {

  schema.path('email').validate(value => {
    return validator.isEmail(value);
  }, '{VALUE} is not a valid email', 'Invalid Email');

  schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  schema.options.toJSON = {
    transform: function (doc, ret, options) {
      delete ret.password
      return ret;
    }
  }

  schema.pre('save', function (next) {
    if (this.password) {
      let genSalt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, genSalt);
    }

    this.verificationHash = _.sampleSize(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''), 7
    ).join('');

    next();
  });

  // if there is need to index the 'verificationHash' in future;
  if (options && options.index) {
    schema.path('verificationHash').index(options.index);
  }
};
