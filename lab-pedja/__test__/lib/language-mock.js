'use strict';

const faker = require('faker');
const countryMock = require('./country-mock');
const Language = require('../../model/language');

const languageMock = module.exports = {};

languageMock.create = () => {
  let mock = {};

  return countryMock.create()
    .then(country => {
      mock.country = country;

      return new Language({
        name : faker.lorem.word(),
        origin : faker.random.word(),
        country : country._id,
      }).save();
    })
    .then(language => {
      mock.language = language;
      return mock;
    });
};

languageMock.remove = () => Promise.all([
  Language.remove({}),
  countryMock.remove(),
]);
