'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Language = require('../model/language');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/languages`;

const languageMockCreate = () => {
  return new Language({
    name : faker.lorem.word(),
    origin : faker.address.country(),
    type : faker.hacker.adjective(),
  }).save();
};

const languageMockCreateMany = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => languageMockCreate()));
};

describe('/api/languages', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Language.remove({}));

  // POST METHOD
  // -----------------------------------------------------
  describe('POST /api/languages', () => {
    test('POST should respond with a language and 200 status code if there is no error', () => {
      let languageToPost = {
        name : faker.lorem.word(),
        origin : faker.address.country(),
        type : faker.hacker.adjective(),
      };
      return superagent.post(`${apiURL}`)
        .send(languageToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(languageToPost.name);
          expect(response.body.origin).toEqual(languageToPost.origin);
          expect(response.body.type).toEqual(languageToPost.type);
        });
    });
    test('POST should respond with 400 code if we send incomplete Language object', () => {
      let languageToPost = {
        name : faker.lorem.word(),
      };
      return superagent.post(`${apiURL}`)
        .send(languageToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  // GET METHOD
  // -----------------------------------------------------
  describe('GET /api/languages', () => {
    test('GET should respond with a code 200 if there is no error', () => {
      let languageToTest = null;

      return languageMockCreate()
        .then(language => {
          languageToTest = language;
          return superagent.get(`${apiURL}/${language.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(languageToTest._id.toString());

          expect(response.body.name).toEqual(languageToTest.name);
          expect(response.body.origin).toEqual(languageToTest.origin);
          expect(response.body.type).toEqual(languageToTest.type);
        });
    });
    test('GET should respond with 404 code if ID is incorrect', () => {
      return superagent.get(`${apiURL}/nadsat`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  



});
