// From swagger-tools -
// Assertation 1: Security requirements defined in securityDefinitions should be used in the spec
// Assertation 2: Each scope defined in an OAuth2 scheme should be used in the spec

import each from "lodash/each"
import defaults from "../../../../.defaultsForValidator"

export function validate({ jsSpec }, config) {

  const result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.security_definitions


  const usedSchemes = {}
  const usedScopes = {}

  // collect the security requirements and all relevant scopes
  
  const securityDefinitions = jsSpec.securityDefinitions

  each(securityDefinitions, (scheme, name) => {
    if (name.slice(0,2) === "x-") return

    usedSchemes[name] = {}
    usedSchemes[name].used = false
    usedSchemes[name].type = scheme.type

    // collect scopes in oauth2 schemes
    if (scheme.type.toLowerCase() === "oauth2") {
      Object.keys(scheme.scopes).forEach(scope => {
        usedScopes[scope] = {}
        usedScopes[scope].used = false
        usedScopes[scope].scheme = name
      })
    }
  })


  // check all instances of 'security' objects
  // security objects can exist at either:

  // 1) the top level of the spec (global definition)
  if (jsSpec.security) {
    flagUsedDefinitions(jsSpec.security)
  }

  // 2) within operations objects
  const paths = jsSpec.paths
  each(paths, (operations, pathName) => {
    if (pathName.slice(0,2) === "x-") return
    each(operations, (operation, opName) => {
      if (opName.slice(0,2) === "x-") return
      if (operation.security) {
        flagUsedDefinitions(operation.security)
      }
    })
  })


  function flagUsedDefinitions(security) {

    security.forEach(scheme => {

      // each object in this array should only have one key - the name of the scheme
      const name = Object.keys(scheme)[0]

      // make sure this scheme was in the securityDefinitions, then label as used
      if (usedSchemes[name]) {

        usedSchemes[name].used = true

        const type = usedSchemes[name].type
        const scopesArray = scheme[name]

        if (type.toLowerCase() === "oauth2") {
          scopesArray.forEach(scope => {
            if (usedScopes[scope]) {
              usedScopes[scope].used = true
            }
          })
        }
      }
    })
  }


  // check what has been used and what has not been
  each(usedSchemes, (info, name) => {
    if (info.used === false) {
      const checkStatus = config.unused_security_schemes
      if (checkStatus !== "off") {
        result[checkStatus].push({
          path: `securityDefinitions.${name}`,
          message: `The security scheme ${name} is defined but is never used.`
        })
      }
    }
  })

  each (usedScopes, (info, name) => {
    if (info.used === false) {
      const checkStatus = config.unused_security_scopes
      if (checkStatus !== "off") {
        result[checkStatus].push({
          path: `securityDefinitions.${info.scheme}.scopes.${name}`,
          message: `The security scope ${name} is defined but is never used.`
        })
      }
    }
  })

  return { errors: result.error, warnings: result.warning }
}
