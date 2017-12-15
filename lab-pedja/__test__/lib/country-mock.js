'use strict';

const faker = require('faker');
const Country = require('../../model/country');

const countryMock = module.exports = {};

countryMock.create = () => {
  return new Country({
    name : faker.lorem.word(),
    keywords : faker.lorem.words(5).split(' '),
  }).save();
};

countryMock.remove = () => Country.remove({});
