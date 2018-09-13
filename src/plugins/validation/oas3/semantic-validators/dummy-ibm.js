/* eslint-disable */

module.exports.validate = function({ jsSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

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

  return { errors: result.error, warnings: result.warning }
}
