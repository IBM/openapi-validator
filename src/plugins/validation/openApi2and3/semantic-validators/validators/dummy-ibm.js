/* eslint-disable */

import defaults from "../../../../../.defaultsForValidator"

export function validate({ jsSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

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
