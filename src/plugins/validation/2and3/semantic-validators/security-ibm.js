// from openapi spec -
// Assertation 1:
// Swagger 2
// For security scheme types other than OAuth2, the security array MUST be empty.
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject
// OpenAPI 3
// If the security scheme is of type "oauth2" or "openIdConnect", then the value is a list of scope 
//   names required for the execution. For other security scheme types, the array MUST be empty.
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#securityRequirementObject


import each from "lodash/each"

export function validate({ jsSpec, isOAS3 }, config) {

  const result = {}
  result.error = []
  result.warning = []

  config = config.security

  // check all instances of 'security' objects
  const securityObjects = []

  // security objects can exist at either:

  // 1) the top level of the spec (global definition)
  if (jsSpec.security) {
    securityObjects.push({
      security: jsSpec.security,
      path: "security"
    })
  }

  // 2) within operations objects
  const paths = jsSpec.paths
  each(paths, (operations, pathName) => {
    if (pathName.slice(0,2) === "x-") return
    each(operations, (operation, opName) => {
      if (opName.slice(0,2) === "x-") return
      if (operation.security) {
        securityObjects.push({
          security: operation.security,
          path: `paths.${pathName}.${opName}.security`
        })
      }
    })
  })

  const securityDefinitions = isOAS3
    ? jsSpec.components && jsSpec.components.securitySchemes
    : jsSpec.securityDefinitions

  // if there are no security definitions, don't bother running these checks
  // the unmatched security requirements will throw errors in another part of
  // the validator
  if (securityObjects.length && securityDefinitions) {
    securityObjects.forEach(obj => {
      checkForInvalidNonEmptyArrays(obj)
    })
  }

  function checkForInvalidNonEmptyArrays({ security, path }) {

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
      const schemeIsDefined = securityDefinitions[schemeName]
      const schemesWithNonEmptyArrays = isOAS3 ? ["oauth2", "openIdConnect"] : ["oauth2"]

      if (isNonEmptyArray && schemeIsDefined) {
        const schemeType = securityDefinitions[schemeName].type
        if (!schemesWithNonEmptyArrays.includes(schemeType)) {
          const checkStatus = config.invalid_non_empty_security_array
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `${path}.${schemeName}`,
              message: `For security scheme types other than ${schemesWithNonEmptyArrays.join(" or ")}, the value must be an empty array.`
            })
          }
        }
      }
    })
  }

  return { errors: result.error, warnings: result.warning }
}
