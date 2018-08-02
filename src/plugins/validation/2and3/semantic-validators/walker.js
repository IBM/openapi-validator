// Walks an entire spec.

// Assertation 1:
// `type` values for properties must be strings
// multi-type properties are not allowed

// Assertation 2:
// In specific areas of a spec, allowed $ref values are restricted.

// Assertation 3:
// Sibling keys with $refs are not allowed - default set to `off`
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#sibling-elements-for-refs

import match from "matcher"

export function validate({ jsSpec, isOAS3 }, config) {
  let errors = []
  let warnings = []

  config = config.walker

  function walk(value, path) {
    const current = path[path.length - 1]

    if(value === null) {
      return null
    }

    // don't walk down examples or extensions
    if (current === "example" || current === "examples" || (current && current.slice(0,2) === "x-")) {
      return
    }

    // parent keys that allow non-string "type" properties. for example,
    // having a definition called "type" is allowed
    const allowedParents = isOAS3
      ? [
          "schemas",
          "properties",
          "responses",
          "parameters",
          "requestBodies",
          "headers",
          "securitySchemes"
        ]
      : [
          "definitions",
          "properties",
          "parameters",
          "responses",
          "securityDefinitions"
        ]

    ///// "type" should always have a string-type value, everywhere.
    if(current === "type" && allowedParents.indexOf(path[path.length - 2]) === -1) {
      if(typeof value !== "string") {
        errors.push({
          path,
          message: "\"type\" should be a string"
        })
      }

    }

    ///// Minimums and Maximums

    if(value.maximum && value.minimum) {
      if(greater(value.minimum, value.maximum)) {
        errors.push({
          path: path.concat(["minimum"]),
          message: "Minimum cannot be more than maximum"
        })
      }
    }

    if(value.maxProperties && value.minProperties) {
      if(greater(value.minProperties, value.maxProperties)) {
        errors.push({
          path: path.concat(["minProperties"]),
          message: "minProperties cannot be more than maxProperties"
        })
      }
    }

    if(value.maxLength && value.minLength) {
      if(greater(value.minLength, value.maxLength)) {
        errors.push({
          path: path.concat(["minLength"]),
          message: "minLength cannot be more than maxLength"
        })
      }
    }

    ///// Restricted $refs

    if(current === "$ref") {
      const blacklistPayload = getRefPatternBlacklist(path, isOAS3)
      let refBlacklist = blacklistPayload.blacklist || []
      let matches = match([value], refBlacklist)

      if(refBlacklist && refBlacklist.length && matches.length) {
        // Assertation 2
        // use the slice(1) to remove the `!` negator fromt he string
        errors.push({
          path,
          message: `${blacklistPayload.location} $refs must follow this format: ${refBlacklist[0].slice(1)}`
        })
      }
    }

    if(typeof value !== "object") {
      return null
    }

    let keys = Object.keys(value)

    if(keys.length) {
      ///// $ref siblings
      return keys.map(k => {
        if(keys.indexOf("$ref") > -1 && k !== "$ref") {
          switch (config.$ref_siblings) {
            case "error":
              errors.push({
                path: path.concat([k]),
                message: "Values alongside a $ref will be ignored."
              })
              break
            case "warning":
              warnings.push({
                path: path.concat([k]),
                message: "Values alongside a $ref will be ignored."
              })
              break
            default:
              break
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

// values are globs!
const unacceptableRefPatternsS2 = {
  responses: ["!*#/responses*"],
  schema: ["!*#/definitions*"],
  parameters: ["!*#/parameters*"]
}

const unacceptableRefPatternsOAS3 = {
  responses: ["!*#/components/responses*"],
  schema: ["!*#/components/schemas*"],
  parameters: ["!*#/components/parameters*"],
  requestBody: ["!*#/components/requestBodies*"],
  security: ["!*#/components/securitySchemes*"],
  callbacks: ["!*#/components/callbacks*"],
  examples: ["!*#/components/examples*"],
  headers: ["!*#/components/headers*"]
}

let exceptionedParents = ["properties"]

function getRefPatternBlacklist(path, isOAS3) {
  const unacceptableRefPatterns = isOAS3
    ? unacceptableRefPatternsOAS3
    : unacceptableRefPatternsS2
  let location = ""
  const blacklist = path.reduce((prev, curr, i) => {
    let parent = path[i - 1]
    if(unacceptableRefPatterns[curr] && exceptionedParents.indexOf(parent) === -1) {
      location = curr
      return unacceptableRefPatterns[curr]
    } else {
      return prev
    }
  }, null)
  return { blacklist, location }
}

function greater(a, b) {
  // is a greater than b?
  return a > b
}
