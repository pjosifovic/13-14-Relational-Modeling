'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
// const faker = require('faker');
const countryMock = require('./lib/country-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/countries`;

describe('/api/countries', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(countryMock.remove);

  // POST METHOD
  describe('POST /countries', () => {
    test('POST should return a 200 and a country if there are no errors', () => {
      return superagent.post(apiURL)
        .send({
          name : 'cats',
          keywords : ['animals', 'cute'],
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.keywords).toEqual(['animals','cute']);
        });
    });
    test('POST should return a 409 due to duplicate name property', () => {
      return countryMock.create()
        .then(country => {
          return superagent.post(apiURL)
            .send({
              name : country.name,
              keywords : [],
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
    test('POST should return 400 if we send incomplete object', () => {
      return countryMock.create()
        .then(() => {
          return superagent.post(apiURL)
            .send({
              name : '',
              keywords : [],
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
  });

  // GET METHOD
  describe('GET /countries/:id', () => {
    test('GET should respond with a 200 status if there are no error', () => {

      return countryMock.create()
        .then(country => {
          return superagent.get(`${apiURL}/${country._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
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
  describe('DELETE /api/countries/:id', () => {
    test('DELETE should respond with code 204 if there is no error', () => {
      return countryMock.create()
        .then(country => {
          return superagent.delete(`${apiURL}/${country._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('DELETE should respond with 404 code if ID is incorrect', () => {
      return superagent.delete(`${apiURL}/nadsat`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

});
