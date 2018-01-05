// Assertation 1:
// The description, when present, should not be empty or contain empty space

import includes from "lodash/includes"

import defaults from "../../../../.defaultsForValidator.js"

// Walks an entire spec.
export function validate({ jsSpec }, config) {
  
  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.walker


  function walk(value, path) {

    if(value === null) {
      return null
    }

    if(typeof value !== "object") {
      return null
    }

    let keys = Object.keys(value)

    if(keys.length) {
      // skip walking down operations that are excluded
      if (value["x-sdk-exclude"] === true) {
        return null
      }
      return keys.map(k => {
        // skip walking down any vendor extensions
        if (k.slice(0,2) === "x-") return null
        if(k === "description" && !(includes(path, "examples"))){
          var descriptionValue = value["description"].toString()
          if ((descriptionValue.length === 0) || (!descriptionValue.trim())) {

            let checkStatus = config.no_empty_descriptions
            if (checkStatus !== "off") {
              result[checkStatus].push({
                path: path.concat([k]),
                message: "Items with a description must have content in it."
              })
            }

          }
        }
        return walk(value[k], [...path, k])
      })

    } else {
      return null
    }

  }

  walk(jsSpec, [])

  return { errors: result.error, warnings: result.warning }
}
