'use strict';

const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  origin : {
    type : String,
    required : true,
  },
  type : {
    type : String,
    default : 'Argot',
  },
});

module.exports = mongoose.model('language', languageSchema);
