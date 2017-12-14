'use strict';

const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  keywords : [{
    type : String,
  }],
  timeStamp : {
    type : Date,
    default : () => new Date(),
  },
  languages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'language',
  }],
},{
  usePushEach : true,
});

module.exports = mongoose.model('countrie', countrySchema);
