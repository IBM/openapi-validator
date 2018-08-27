// From swagger-tools -
// Assertation 1: Security requirements defined in securityDefinitions should be used in the spec
// Assertation 2: Each scope defined in an OAuth2 scheme should be used in the spec

const each = require("lodash/each")

module.exports.validate = function({ jsSpec, isOAS3 }, config) {

  const result = {}
  result.error = []
  result.warning = []

  config = config.security_definitions

  const usedSchemes = {}
  const usedScopes = {}

  // collect the security requirements and all relevant scopes

  const securityDefinitions = isOAS3 
    ? jsSpec.components && jsSpec.components.securitySchemes
    : jsSpec.securityDefinitions

  each(securityDefinitions, (scheme, name) => {
    if (name.slice(0,2) === "x-") return

    usedSchemes[name] = {}
    usedSchemes[name].used = false
    usedSchemes[name].type = scheme.type

    // collect scopes in oauth2 schemes
    if (scheme.type.toLowerCase() === "oauth2") {
      if (isOAS3) {
        if (scheme.flows) {
          each(scheme.flows, (flow, flowType) => {
            if (flow.scopes) {
              Object.keys(flow.scopes).forEach(scope => {
                usedScopes[scope] = {}
                usedScopes[scope].used = false
                usedScopes[scope].scheme = name
                usedScopes[scope].flow = flowType
              })
            }
          })
        }
      } else {
        Object.keys(scheme.scopes).forEach(scope => {
          usedScopes[scope] = {}
          usedScopes[scope].used = false
          usedScopes[scope].scheme = name
        })
      }
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

      // make sure this scheme was in the security definitions, then label as used
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
        const location = isOAS3
          ? "components.securitySchemes"
          : "securityDefinitions"
        result[checkStatus].push({
          path: `${location}.${name}`,
          message: `The security scheme ${name} is defined but is never used.`
        })
      }
    }
  })

  each (usedScopes, (info, name) => {
    if (info.used === false) {
      const checkStatus = config.unused_security_scopes
      if (checkStatus !== "off") {
        const path = isOAS3
          ? `components.securitySchemes.${info.scheme}.flows.${info.flow}.scopes.${name}`
          : `securityDefinitions.${info.scheme}.scopes.${name}`
        result[checkStatus].push({
          path,
          message: `The security scope ${name} is defined but is never used.`
        })
      }
    }
  })

  return { errors: result.error, warnings: result.warning }
}
