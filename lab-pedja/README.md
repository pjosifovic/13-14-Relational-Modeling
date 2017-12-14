![cf](https://i.imgur.com/7v5ASc8.png) Class 13 Express and Mongo REST API + Middleware
======

* Create HTTP rest server using express and mongo with adding middleware to handle errors.

  * display all data (GET method)
  * display single object from database if correct id is passed to the request  (GET method)
  * add object to database (POST)
  * delete object from the database (DELETE)
  * update object from the database (PUT)

## Code Style
* Javascript + ES6, Express JS, Mongodb, Mongoose


## Tech / framework used
* [npm package faker](https://www.npmjs.com/package/faker) creating random generated text.
* [npm package http-errors](https://www.npmjs.com/package/uuid) to handle HTTP request/response error.
* [npm package winston](https://www.npmjs.com/package/winston) as a logging library.
* [npm package jest](http://facebook.github.io/jest/) used for TDD
* [npm package dotenv](https://www.npmjs.com/package/dotenv) for loading env variables.
* [npm package superagent](https://www.npmjs.com/package/superagent) for testing http requests


## Installation and How To Use

  * Fork || clone this repo to you computer.

  * Run `npm install`

  * Create .env file and add `PORT=<port>` and `MONGODB_URI=mongodb://localhost/testing`.

  * Make POST, GET, PUT and DELETE request to the server.



## Routes

  * Use **POST** `/api/languages/` to add more languages into db:

     * sends new JSON object that has following properties: `name`, `origin`, `type` and unique `id`. Name and origin properties are **required** and `name` is **unique**.

     * if `name` or `origin` is left out, 400 status code will be returned.

     * if object with same `name` property is send, 409 status code will be returned marking conflict in request.


 * Use **GET** `/api/languages/<language id>` to fetch specific language by its id from db:

    * Returns language with requested id - 200 status code.

    * If ID is invalid - it will return 404 status code error.

* Use **DELETE** `/api/languages/<language id>` to delete specific language by its id from db:

   * Deletes language with requested id and returns 204 successful status code.

   * If language ID is invalid/not found - it will return 404 status code error.

* Use **PUT** `/api/languages/<language id>` to delete specific language by its id from db:

  * Updates language properties if language ID is valid and returns 200 successful status code.

  * If language ID property is invalid - it will return 404 status code error.

  * If language ID property is missing - it will return 400 status code error.

  * If trying to change `name` property of one object to already existing one - it will return 409 status code error(conflict in request).


## Licence
MIT © Pedja Josifovic
