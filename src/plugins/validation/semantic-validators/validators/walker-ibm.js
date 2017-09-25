// Assertation 1:
// The description, when present, should not be empty or contain empty space

// Walks an entire spec.
import includes from "lodash/includes"

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  function walk(value, path) {

    if(value === null) {
      return null
    }

    if(typeof value !== "object") {
      return null
    }

    let keys = Object.keys(value)

    if(keys.length) {
      return keys.map(k => {
        if(k === "description" && !(includes(path, "examples"))){
          var descriptionValue = value["description"].toString()
          if ((descriptionValue.length === 0) || (!descriptionValue.trim())) {
            errors.push({
              path: path.concat([k]),
              message: "Items with a description must have content in it."
            })
        }
      }
        return walk(value[k], [...path, k])
      })

    } else {
      return null
    }

  }

  walk(jsSpec, [])

  return { errors, warnings }
}
