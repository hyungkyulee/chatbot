'use strict';

const lexResponses = require('./lexResponse');

const refServiceTypes = ['annual', 'breakdown'];
const regExSerialCode = /[a-zA-Z0-9]{15}/;

function buildValidationResult(isValid, violatedSlot, messageContent) {
  if(messageContent == null) {
    return {
      isValid, 
      violatedSlot,
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent },
  };
}

function validateBookService(serviceType, serialCode) {
  if(serviceType && (refServiceTypes.indexOf(serviceType.toLowerCase()) === -1)) {
    return buildValidationResult(false, 'Service', `We do not support of ${serviceType}, please choose one of options: 'Annual' or 'Breakdown' Service.`);
  }

  if(serialCode && (regExSerialCode.test(serialCode) === false)) {
    return buildValidationResult(false, 'SerialCode', `The code: ${serialCode} is invalid, please try again with alphanumeric code with 15-digit length.`);
  }

  return buildValidationResult(true, null, null);
}

module.exports = function(intentRequest, callback) {
  var serviceType = intentRequest.currentIntent.slots.Service;
  var name = intentRequest.currentIntent.slots.Name;
  var serialCode = intentRequest.currentIntent.slots.SerialCode;
  var email = intentRequest.currentIntent.slots.Email;
  var address = intentRequest.currentIntent.slots.Address;
  var phone = intentRequest.currentIntent.slots.Phone;
  var visitDate = intentRequest.currentIntent.slots.VisitDate;

  console.log(`=> Service: ${serviceType}, Name: ${name}, SN: ${serialCode}, Email: ${email}, Address: ${address}, Phone: ${phone}, Date of visit: ${visitDate}`);
  const source = intentRequest.invocationSource;
  if(source === 'DialogCodeHook') {
    const slots = intentRequest.currentIntent.slots;
    const validationResult = validateBookService(serviceType, serialCode);

    console.log(`=> validationResult: ${validationResult}`);

    if(!validationResult.isValid) {
      slots[`${validationResult.violatedSlot}`] = null;
      callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message, null));
    }
    callback(lexResponses.delegate(intentRequest.sessionAttrbutes, intentRequest.currentIntent.slots));
    return;
  }
}