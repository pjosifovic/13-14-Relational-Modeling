'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Language = require('../model/language');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const languageRouter = module.exports = new Router();

// POST METHOD
languageRouter.post('/api/languages', jsonParser, (request, response, next) => {
  if(!request.body.name || !request.body.origin) {
    return next(httpErrors(400, 'name and language origin are required'));
  }
  return new Language(request.body).save()
    .then(language => response.json(language))
    .catch(next);
});

// GET METHOD
languageRouter.get('/api/languages/:id', (request, response, next) => {
  return Language.findById(request.params.id)
    .populate('country')
    .then(language => {
      if(!language){
        throw httpErrors(404, 'language not found, please use valid ID');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(language);
    }).catch(next);
});

// DELETE METHOD
languageRouter.delete('/api/languages/:id', (request, response, next) => {
  return Language.findByIdAndRemove(request.params.id)
    .then(language => {
      if(!language){
        throw httpErrors(404, 'hero not found, please use valid ID');
      }
      logger.log('info', 'DELETE - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

// PUT METHOD
languageRouter.put('/api/languages/:id', jsonParser, (request, response, next) => {
  let options = { runValidators : true, new : true};

  return Language.findByIdAndUpdate(request.params.id, request.body, options)
    .then(language => {
      if(!language){
        throw httpErrors(404, 'language not found, please use valid ID');
      }
      logger.log('info', 'PUT - Returning a 204 status code');
      return response.json(language);
    }).catch(next);
});

languageRouter.put('/api/languages', (request, response, next) => {
  logger.log('info', 'PUT - Returning a 400 status code - missing language ID');
  return response.sendStatus(400);
});
