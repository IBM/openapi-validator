// Walks an entire spec.

// Assertation 1:
// In specific areas of a spec, allowed $ref values are restricted.

// Assertation 2:
// Sibling keys with $refs are not allowed.


export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  function walk(value, path) {

    // let curr = path[path.length - 1]

    if(value === null) {
      return null
    }

    if(typeof value !== "object") {
      return null
    }

    let keys = Object.keys(value)
    let values = Object.values(value)

    if(keys.length) {
      return keys.map(k => {
        if(k === "description"){
          var descriptionValue = values[keys.indexOf("description")].toString()
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
