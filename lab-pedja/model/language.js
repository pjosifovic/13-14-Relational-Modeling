'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Country = require('./country')

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
  country : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'countrie',
  },
});

// SETTING UP RELATIONSHIP MANAGEMENT
// ------------------------------------------------
languageSchema.pre('save', function(done){
  return Country.findById(this.country)
    .then(countryFound => {
      if(!countryFound)
        throw httpErrors(404, 'country not found');

      countryFound.languages.push(this._id);
      return countryFound.save();
    })
    .then(() => done())
    .catch(done);
});

languageSchema.post('remove', (document, done) => {
  return Country.findById(document.country)
    .then(countryFound => {
      if(!countryFound)
        throw httpErrors(404, 'country not found');

      countryFound.languages = countryFound.languages.filter(language => {
        return language._id.toString() !== document._id.toString();
      });
      return countryFound.save();
    })
    .then(() => done())
    .catch(done);
});
// ------------------------------------------------

module.exports = mongoose.model('language', languageSchema);
