'use strict';

const bookService = require('./bookService');

module.exports = function(intentRequest, callback) {
  console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;

  if(intentName === 'BookService') {
    console.log(intentName + ' was called');
    return bookService(intentRequest, callback);
  }

  throw new Error(`Intent with name ${intentName} not supported`);
}