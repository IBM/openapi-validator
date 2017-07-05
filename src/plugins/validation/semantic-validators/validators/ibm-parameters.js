// Assertation 1:
// The description when present should not be empty or contain empty space

import snakecase from "lodash/snakeCase"
import last from "lodash/last"
import includes from "lodash/includes"

export function validate({resolvedSpec}) {
  let errors = []
  let warnings = []

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    // 1
    if(path[path.length - 2] === "parameters") {
      if (obj.name === "api_key") {
      }
        if("description" in obj && includes(obj.description.toLowerCase(), " json ")) {
          warnings.push({
            path,
            message: "Descriptions should not state that the model is a JSON object."
          })
        }

        // 2
        if( obj.in && (obj.in !== "header") && !obj.$$ref && obj.name !== snakecase(obj.name)) {
          errors.push({
            path,
            message: "Parameter name must use snake case."
          })
        }

        // 3  Note this check is fast but is slow rendering in the UI so I may remove
        if(obj.$$ref && obj.in && obj.in !== "header") {
        var lastSplit =  last((obj.$$ref).split("/"))
          if(lastSplit !== snakecase(lastSplit)) {

            warnings.push({
              path,
              message: "Internal reference is not using snake case."
            })
          }
        }

      // 5
      var valid = true
      if (obj.format && !obj.$$ref) {
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
    if(Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))

    } else {
      return null
    }
  }

  walk(resolvedSpec, [])
  return { errors, warnings }
}
