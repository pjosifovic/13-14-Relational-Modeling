'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const languageMock = require('./lib/language-mock');
const countryMock = require('./lib/country-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/languages`;

describe('/api/languages', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(languageMock.remove);

  // POST METHOD
  // -----------------------------------------------------
  describe('POST /api/languages', () => {
    test('POST should respond with a language and 200 status code if there is no error', () => {
      let tempCountryMock = null;
      return countryMock.create()
        .then(mock => {
          tempCountryMock = mock;

          let languageToPost = {
            name : faker.lorem.word(),
            origin : faker.random.word(),
            country : mock._id,
          };
          return superagent.post(`${apiURL}`)
            .send(languageToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();

              expect(response.body.country).toEqual(tempCountryMock._id.toString());

              expect(response.body.name).toEqual(languageToPost.name);
              expect(response.body.origin).toEqual(languageToPost.origin);
            });
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
      return languageMock.create()
        .then(mock => {
          return superagent.post(apiURL)
            .send({
              name : mock.language.name,
              origin : mock.language.origin,
              country : mock.country._id,
            });
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
      let tempMock = null;

      return languageMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${mock.language.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(tempMock.language._id.toString());

          expect(response.body.name).toEqual(tempMock.language.name);
          expect(response.body.origin).toEqual(tempMock.language.origin);
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
      return languageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/${mock.language._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('DELETE should respond with 404 if ID is invalid', () => {
      return superagent.delete(`${apiURL}/houndyGregor`)
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

      return languageMock.create()
        .then(mock => {
          languageToUpdate = mock.language;
          return superagent.put(`${apiURL}/${mock.language._id}`)
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
      return languageMock.create()
        .then(mock => {
          return superagent.post(apiURL)
            .send({
              name : mock.language.name,
              origin : mock.language.origin,
              country : mock.country._id,
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

});
