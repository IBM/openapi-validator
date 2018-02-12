// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

// Assertation 3:
// Header parameters must not define a content-type or an accept-type.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#do-not-explicitly-define-a-content-type-header-parameter

import snakecase from "lodash/snakeCase"
import includes from "lodash/includes"

import defaults from "../../../../.defaultsForValidator"

export function validate({jsSpec}, config) {
  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.parameters

  function walk(obj, path) {
    if (typeof obj !== "object" || obj === null) {
      return
    }

    // skip parameters within operations that are excluded
    if (obj["x-sdk-exclude"] === true) {
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
      let isHeaderParameter = (obj.in.toLowerCase() === "header") // header params need not be snake_case
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

      if (isParameter && isHeaderParameter) {
        // check for content-type defined in a header parameter (CT = content-type)
        let checkStatusCT = config.content_type_parameter
        let definesContentType = obj.name.toLowerCase() === "content-type"
        let messageCT = "Parameters must not explicitly define `Content-Type`. Rely on the `consumes` field to specify content-type."
        if (definesContentType && checkStatusCT !== "off") {
          result[checkStatusCT].push({
            path,
            message: messageCT
          })
        }

        // check for accept-type defined in a header parameter (AT = accept-type)
        let checkStatusAT = config.accept_type_parameter
        let definesAcceptType = obj.name.toLowerCase() === "accept"
        let messageAT = "Parameters must not explicitly define `Accept`. Rely on the `produces` field to specify accept-type."
        if (definesAcceptType && checkStatusAT !== "off") {
          result[checkStatusAT].push({
            path,
            message: messageAT
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
      return Object.keys(obj).map(k => {
        // ignore validating all extensions - users need to use custom schemas
        if (k.slice(0,2) !== "x-") {
          return walk(obj[k], [...path, k])
        }
      })
    } else {
      return null
    }
  }

  walk(jsSpec, [])
  return { errors: result.error , warnings: result.warning }
}
