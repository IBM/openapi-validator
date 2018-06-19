// Assertation 1:
// "Parameters MUST have an `in` property."
// `in` is REQUIRED. Possible values are "query", "header", "path" or "cookie".

// Assertation 2:
// A parameter MUST contain either a schema property, or a content property, but not both.

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject

export function validate({ jsSpec }, config) {

  const result = {}
  result.error = []
  result.warning = []

  config = config.parameters

  function walk(obj, path) {
    if (typeof obj !== "object" || obj === null) {
      return
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1]
    if (current === "example" || current === "examples" || (current && current.slice(0,2) === "x-")) {
      return
    }

    const isContentsOfParameterObject = path[path.length - 2] === "parameters"

    // obj is a parameter object
    if (isContentsOfParameterObject) {
      const allowedInValues = ["query", "header", "path", "cookie"]
      if (!obj.in) {
        // bad because in is required
        const checkStatus = config.no_in_property
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message: "Parameters MUST have an `in` property."
          })
        }
      } else if (!allowedInValues.includes(obj.in)) {
        // bad because `in` must be one of a few values
        const checkStatus = config.invalid_in_property
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path: path.concat("in"),
            message: `'${obj.in}' is not a supported value for \`in\`. Allowed values: ${allowedInValues.join(", ")}`
          })
        }
      }

      if (!obj.schema && !obj.content) {
        // bad because at least one is needed
        const checkStatus = config.missing_schema_or_content
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message: "Parameters MUST have their data described by either `schema` or `content`."
          })
        }
      } else if (obj.schema && obj.content) {
        // bad because only one is allowed to be used at a time
        const checkStatus = config.has_schema_and_content
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message: "Parameters MUST NOT have both a `schema` and `content` property."
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

  return { errors: result.error, warnings: result.warning }
}