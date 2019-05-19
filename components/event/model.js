const mongoose = require('mongoose');
const genericPlugin = require('../../helpers/generic-plugin');
const eventPlugin = require('./plugin');

mongoose.Promise = require('bluebird');

const event = new mongoose.Schema({

  title: { type: String, required: true },

  details: { type: String, required: true },

  address: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  from:{ type: Date, required: true },

  to: { type: Date, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },

});

event.plugin(genericPlugin);

event.plugin(eventPlugin);

module.exports = mongoose.model('event', event);
