// Assertation 1:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 2:
// If parameters define their own format, they must follow the formatting rules.

import snakecase from "lodash/snakeCase"
import includes from "lodash/includes"

export function validate({jsSpec}) {
  let errors = []
  let warnings = []

  function walk(obj, path) {
    if (typeof obj !== "object" || obj === null) {
      return
    }

    let contentsOfParameterObject = path[path.length - 2] === "parameters"

    // obj is a parameter object
    if (contentsOfParameterObject) {

      if(!(obj.description)) {
        errors.push({
          path,
          message: "Parameters with a description must have content in it."
        })
      }

      let isRef = !!obj.$ref
      let isParameter = obj.in // the `in` property is required by OpenAPI for parameters - this should be true
      let isHeaderParameter = (obj.in == "header") // header params need not be snake_case
      let isSnakecase = obj.name == snakecase(obj.name)

      // if the parameter is defined by a ref, no need to check the ref path for snake_case
      if (isParameter && !isHeaderParameter && !isRef && !isSnakecase) {
        warnings.push({
          path,
          message: "Parameter name must use snake case."
        })
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
        errors.push({
          path,
          message: "Incorrect Format of " + obj.format + " with Type of " + obj.type + " and Description of " + obj.description
        })
      }
    }
    if (Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))

    } else {
      return null
    }
  }

  walk(jsSpec, [])
  return { errors, warnings }
}
