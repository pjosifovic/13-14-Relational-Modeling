'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
// const Language = require('../model/language');
const server = require('../lib/server');
const languageMock = require('./lib/language-mock');
const countryMock = require('./lib/country-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/languages`;

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
    test('POST should respond with code 409 if you try to update name property', () => {
      let languageToPost = {
        name : faker.lorem.word(),
        origin : faker.address.country(),
      };
      return superagent.post(`${apiURL}`)
        .send(languageToPost)
        .then(() => {
          return superagent.post(`${apiURL}`)
            .send(languageToPost);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
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

  // DELETE METHOD
  // -----------------------------------------------------
  describe('DELETE /api/languages', () => {
    test('DELETE should respond with code 204 if there is no error', () => {
      languageMockCreate()
        .then(language => {
          return superagent.delete(`${apiURL}/${language._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('DELETE should respond with 404 if ID is invalid', () => {
      return superagent.delete(`${apiURL}/hound`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  // PUT METHOD
  // -----------------------------------------------------
  describe('PUT /api/languages/:id', () => {
    test('PUT should update language origin and respond with code 200 if there is no error', () => {
      let languageToUpdate = null;
      return languageMockCreate()
        .then(language => {
          languageToUpdate = language;
          return superagent.put(`${apiURL}/${language._id}`)
            .send({origin : 'Wonderland'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.origin).toEqual('Wonderland');
          expect(response.body.name).toEqual(languageToUpdate.name);
          expect(response.body._id).toEqual(languageToUpdate._id.toString());
        });
    });
    test('PUT should respond with 404 if ID is invalid', () => {
      return superagent.put(`${apiURL}/gregor`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('PUT should respond with 400 if ID is missing', () => {
      return superagent.put(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('PUT should respond with code 409 if you try to update name property', () => {
      let languageToPostOne = {
        name : 'Natsad',
        origin : faker.address.country(),
        type : faker.hacker.adjective(),
      };
      let languageToPostTwo = {
        name : faker.lorem.word(),
        origin : faker.address.country(),
        type : faker.hacker.adjective(),
      };
      return superagent.post(`${apiURL}`)
        .send(languageToPostOne)
        .then(() => {
          return superagent.post(`${apiURL}`)
            .send(languageToPostTwo);
        })
        .then((response) => {
          return superagent.put(`${apiURL}/${response.body._id}`)
            .send({ name : 'Natsad'});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

});
