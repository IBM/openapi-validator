// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

import snakecase from "lodash/snakeCase"
import includes from "lodash/includes"

export function validate({jsSpec}, config) {
  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = {
      no_parameter_description: "error",
      snake_case_only: "warning",
      invalid_type_format_pair: "error"
    }
  }
  else {
    config = config.parameters
  }

  function walk(obj, path) {
    if (typeof obj !== "object" || obj === null) {
      return
    }

    let contentsOfParameterObject = path[path.length - 2] === "parameters"

    // obj is a parameter object
    if (contentsOfParameterObject) {

      let isRef = !!obj.$ref
      let hasDescription = !!obj.description

      if(!hasDescription && !isRef) {
        let message = "Parameter objects must have a `description` field."
        let checkStatus = config.no_parameter_description
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
          })
        }
      }

      let isParameter = obj.in // the `in` property is required by OpenAPI for parameters - this should be true
      let isHeaderParameter = (obj.in == "header") // header params need not be snake_case
      let isSnakecase = obj.name == snakecase(obj.name)

      // if the parameter is defined by a ref, no need to check the ref path for snake_case
      if (isParameter && !isHeaderParameter && !isRef && !isSnakecase) {
        let message = "Parameter name must use snake case."
        let checkStatus = config.snake_case_only
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
          })
        }
      }

      var valid = true
      if (obj.format && !obj.$ref) {
        switch (obj.type) {
            case "integer":
                valid = includes(["int32","int64"], obj.format.toLowerCase())
              break
            case "string":
                valid = includes(["byte","date","date-time","password"], obj.format.toLowerCase())
              break
            case "number":
                valid = includes(["float","double"], obj.format.toLowerCase())
              break
            case "boolean":
                valid = false
              break
            default:
              valid = true
          }
        }

      if (!valid) {
        let message = "Incorrect Format of " + obj.format + " with Type of " + obj.type + " and Description of " + obj.description
        let checkStatus = config.invalid_type_format_pair
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
          })
        }
      }
    }
    if (Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))

    } else {
      return null
    }
  }

  walk(jsSpec, [])
  return { errors: result.error , warnings: result.warning }
}
