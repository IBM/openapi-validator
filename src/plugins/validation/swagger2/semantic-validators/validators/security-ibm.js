// from openapi spec -
// Assertation 1: For security scheme types other than OAuth2, the security array MUST be empty.
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject

import each from "lodash/each"
import defaults from "../../../../../.defaultsForValidator"

export function validate({ jsSpec }, config) {

  const result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.security


  // check all instances of 'security' objects
  // security objects can exist at either:

  // 1) the top level of the spec (global definition)
  if (jsSpec.security) {
    const path = "security"
    checkForInvalidNonEmptyArrays(jsSpec.security, path)
  }

  // 2) within operations objects
  const paths = jsSpec.paths
  each(paths, (operations, pathName) => {
    if (pathName.slice(0,2) === "x-") return
    each(operations, (operation, opName) => {
      if (opName.slice(0,2) === "x-") return
      if (operation.security) {
        const path = `paths.${pathName}.${opName}.security`
        checkForInvalidNonEmptyArrays(operation.security, path)
      }
    })
  })

  function checkForInvalidNonEmptyArrays(security, path) {

    security.forEach(schemeObject => {

      // each object in this array should only have one key - the name of the scheme
      const schemeNames = Object.keys(schemeObject)
      const schemeName = schemeNames[0]

      // if there is more than one key, they will be ignored. the structural validator should
      // catch these but in case the spec changes in later versions of swagger,
      // a non-configurable warning should be printed to alert the user
      if (schemeNames.length > 1) {
        result.warning.push({
          path,
          message: "The validator expects only 1 key-value pair for each object in a security array."
        })
      }

      const isNonEmptyArray = schemeObject[schemeName].length > 0
      const schemeIsDefined = jsSpec.securityDefinitions[schemeName]

      if (isNonEmptyArray && schemeIsDefined) {
        if (jsSpec.securityDefinitions[schemeName].type.toLowerCase() !== "oauth2") {
          const checkStatus = config.invalid_non_empty_security_array
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `${path}.${schemeName}`,
              message: "For security scheme types other than OAuth2, the value must be an empty array."
            })
          }
        }
      }
    })
  }

  return { errors: result.error, warnings: result.warning }
}
