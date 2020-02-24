/* eslint-disable */

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }, config) {

  const messages = new MessageCarrier(config);

  // use the appropriate validation category object
  // ex) `config = config.operations` for the operations validator

/*
  config = config.category
*/



  // do stuff



  // error pushing format:

/*
  messages.addMessage(
    path,
    message,
    config.custom_rule_name,
    'custom_rule_name'
  )
*/

  return messages;
}
