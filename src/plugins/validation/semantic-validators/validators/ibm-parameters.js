// Assertation 1:
// The description when present should not be empty or contain empty space

import snakecase from "lodash/snakecase"
import last from "lodash/last"
import includes from "lodash/includes"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    // 1
    if(path[path.length - 2] === "parameters") {
      if("description" in obj && (obj.description.length === 0 || !obj.description.trim())) {
        errors.push({
          path,
          message: "Parameters with a description must have content in it."
        })
      }

      if("description" in obj && includes(obj.description.toLowerCase(), " json ")) {
        errors.push({
          path,
          message: "Descriptions should not state that the model is a JSON object."
        })
      }

      // 2
      if(obj.name !== snakecase(obj.name)) {
        errors.push({
          path,
          message: "Parameter name must use snake case."
        })
      }

      // 3  Note this check is fast but is slow rendering in the UI so I may remove
      if(obj.$$ref) {
      var lastSplit =  last((obj.$$ref).split("/"))
        if(lastSplit !== snakecase(lastSplit)) {

          warnings.push({
            path,
            message: "Internal reference is not using snake case."
          })
        }
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
