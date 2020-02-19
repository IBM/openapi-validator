/* eslint-disable */

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }, config) {

  const messages = new MessageCarrier();

  // use the appropriate validation category object
  // ex) `config = config.operations` for the operations validator

/*
  config = config.category
*/



  // do stuff



  // error pushing format:

/*
  let checkStatus = config.custom_rule_name
  if (checkStatus !== "off") {
    result[checkStatus].push({
      path: "path to error, either as an array or a string",
      message: "message about the error/warning"
    })
  }
*/

  return messages;
}
