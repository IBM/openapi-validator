// Assertation 1:
// The description when present should not be empty or contain empty space

import snakecase from "lodash/snakeCase"
import last from "lodash/last"
import includes from "lodash/includes"

export function validate({jsSpec}) {
  let errors = []
  let warnings = []
  //debugger

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    if(path[0] === "definitions" && path[path.length - 2] === "properties" && path[path.length - 3] !== "items" && !obj.$ref) {
      if(!(obj.description)) {
        errors.push({
          path,
          message: "Parameters must have a description with content in it."
        })
      }
    }

    if(obj.description && (obj.description.toLowerCase !== undefined) && includes(obj.description.toLowerCase(), "json")) {
      warnings.push({
        path: path,
        message: "Descriptions should not state that the model is a JSON object."
      })
    }
    if(path[path.length - 2] === "parameters") {

        // *****
        // when would this check occur?
        if( ("$ref" in obj) && (obj.description.length === 0 || !obj.description.trim()) ) {
          errors.push({
            path,
            message: "Parameters with a description must have content in it."
          })
        }

        if(!(obj.description)) {
          errors.push({
            path,
            message: "Parameters with a description must have content in it."
          })
        }

        // the 'in' property is required by openapi for parameters
        if( obj.in && (obj.in !== "header") && !obj.$ref && obj.name !== snakecase(obj.name)) {
          errors.push({
            path,
            message: "Parameter name must use snake case."
          })
        }

        // 3  Note this check is fast but is slow rendering in the UI so I may remove
        // *****
        // when would this check occur?
        if(obj.$ref && obj.in && obj.in !== "header") {
        var lastSplit = last((obj.$ref).split("/"))
          if(lastSplit !== snakecase(lastSplit)) {

            warnings.push({
              path,
              message: "Internal reference is not using snake case."
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

  walk(jsSpec, [])
  return { errors, warnings }
}
