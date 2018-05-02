/* eslint-env mocha */
import expect from "expect"
import { validate } from "../../../../../src/plugins/validation/swagger2/semantic-validators/validators/security-definitions-ibm"

describe("validation plugin - semantic - security-definitions-ibm", function(){

  it("should warn about an unused security definition", function(){

    const config = {
      "security_definitions": {
        "unused_security_schemes": "warning",
        "unused_security_scopes": "warning"
      }
    }

    const spec = {
      securityDefinitions: {
        basicAuth: {
          type: "basic"
        },
        coolApiAuth: {
          type: "oauth2",
          scopes: {
            "read:coolData": "read some cool data"
          }
        },
        api_key: { // eslint-disable-line camelcase
          type: "apiKey",
          name: "api_key",
          in: "header"
        }
      },
      security: [
        {
          basicAuth: []
        }
      ],
      paths: {
        "CoolPath/secured": {
          get: {
            operationId: "secureGet",
            summary: "secure get operation",
            security: [
              {
                coolApiAuth: [
                  "read:coolData"
                ]
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].message).toEqual("The security scheme api_key is defined but is never used.")
    expect(res.warnings[0].path).toEqual("securityDefinitions.api_key")
  })


  it("should warn about an unused security scope", function(){

    const config = {
      "security_definitions": {
        "unused_security_schemes": "warning",
        "unused_security_scopes": "warning"
      }
    }

    const spec = {
      securityDefinitions: {
        coolApiAuth: {
          type: "oauth2",
          scopes: {
            "read:coolData": "read some cool data",
            "write:otherCoolData": "write lots of cool data",
            "read:unusedScope": "this scope will not be used"
          }
        }
      },
      security: [
        {
          coolApiAuth: [
            "write:otherCoolData"
          ]
        }
      ],
      paths: {
        "CoolPath/secured": {
          get: {
            operationId: "secureGet",
            summary: "secure get operation",
            security: [
              {
                coolApiAuth: [
                  "read:coolData"
                ]
              }
            ]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].message).toEqual("The security scope read:unusedScope is defined but is never used.")
    expect(res.warnings[0].path).toEqual("securityDefinitions.coolApiAuth.scopes.read:unusedScope")
  })


  it("should not complain if there are no security definitions", function(){

    const config = {
      "security_definitions": {
        "unused_security_schemes": "warning",
        "unused_security_scopes": "warning"
      }
    }

    const spec = {
      paths: {
        "CoolPath/secured": {
          get: {
            operationId: "secureGet",
            summary: "secure get operation",
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })
})
