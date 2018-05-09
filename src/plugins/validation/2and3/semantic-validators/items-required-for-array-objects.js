// Assertation 1:
// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array

// Assertation 2:
// The required properties for a Schema Object must be defined in the object or one of its ancestors.

// Assertation 3 (for Swagger 2 specs):
// Headers with 'array' type require an 'items' property


export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    // `definitions` for Swagger 2, `schemas` for OAS 3
    // `properties` applies to both
    const modelLocations = ["definitions", "schemas", "properties"]

    if(path[path.length - 1] === "schema" || modelLocations.indexOf(path[path.length - 2]) > -1) {
      // if parent is 'schema', or we're in a model definition

      // Assertation 1
      if(obj.type === "array" && typeof obj.items !== "object") {
        errors.push({
          path: path.join("."),
          message: "Schema objects with 'array' type require an 'items' property"
        })
      }

      // Assertation 2
      if(Array.isArray(obj.required)) {
        obj.required.forEach((requiredProp, i) => {
          if(!obj.properties || !obj.properties[requiredProp]) {
            let pathStr = path.concat([`required[${i}]`]).join(".")
            errors.push({
              path: pathStr,
              message: "Schema properties specified as 'required' must be defined"
            })
          }
        })
      }

    }

    // this only applies to Swagger 2
    if(path[path.length - 2] === "headers") {
      if(obj.type === "array" && typeof obj.items !== "object") {
        errors.push({
          path,
          message: "Headers with 'array' type require an 'items' property"
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
