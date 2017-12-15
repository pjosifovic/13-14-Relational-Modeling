'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Country = require('../model/country');

const countryRouter = module.exports = new Router();


// POST METHOD
countryRouter.post('/api/countries',jsonParser,(request,response,next) => {
  if(!request.body.name)
    return next(httpErrors(400,'country model requires a name'));

  return new Country(request.body).save()
    .then(country => response.json(country))
    .catch(next);
});

// PUT METHOD
countryRouter.put('api/countries/:id', jsonParser, (request, response, next) => {
  let options = { new : true, runValidators : true};

  return Country.findByIdAndUpdate(request.params._id, request.body, options)
    .then(country => {
      if(!country)
        throw httpErrors(404, 'country not found');
      return response.json(country);
    })
    .catch(next);
});

// GET METHOD
countryRouter.get('/api/countries/:id',(request,response,next) => {
  return Country.findById(request.params.id)
    .then(country => {
      if(!country)
        throw httpErrors(404,'country not found');
      return response.json(country);
    })
    .catch(next);
});

// DELETE METHOD
countryRouter.delete('/api/countries/:id',(request,response,next) => {
  return Country.findByIdAndRemove(request.params.id)
    .then(country => {
      if(!country)
        throw httpErrors(404,'country not found');

      return response.sendStatus(204);
    })
    .catch(next);
});
