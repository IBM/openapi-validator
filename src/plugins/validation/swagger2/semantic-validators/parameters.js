// Assertation 1:
// The items property for a parameter is required when its type is set to array

// Assertation 1:
// Required parameters should not specify a `default` value

export function validate({ resolvedSpec }, config) {
  const result = {}
  result.error = []
  result.warning = []

  config = config.parameters

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1]
    if (current === "example" || current === "examples" || (current && current.slice(0,2) === "x-")) {
      return
    }

    const contentsOfParameterObject = path[path.length - 2] === "parameters"
    if(contentsOfParameterObject) {
      // 1
      if(obj.type === "array" && typeof obj.items !== "object") {
        result.error.push({
          path,
          message: "Parameters with 'array' type require an 'items' property."
        })
      }

      // 2
      if (obj.required && obj.default !== undefined) {
        const message = "Required parameters should not specify default values."
        const checkStatus = config.required_param_has_default
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
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

  return { errors: result.error, warnings: result.warning }
}
