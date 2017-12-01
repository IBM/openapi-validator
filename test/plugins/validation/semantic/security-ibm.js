/* eslint-env mocha */
import expect from "expect"
import { validate } from "../../../../src/plugins/validation/semantic-validators/validators/security-ibm"

describe("validation plugin - semantic - security-ibm", function(){

  it("should error on a non-empty array for security object that is not of type oauth2", function(){

    const config = {
      "security": {
        "invalid_non_empty_security_array": "error"
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
        }
      },
      security: [
        {
          basicAuth: ["not a good place for a scope"]
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
    expect(res.errors.length).toEqual(1)
    expect(res.warnings.length).toEqual(0)
    expect(res.errors[0].message).toEqual("For security scheme types other than OAuth2, the value must be an empty array.")
    expect(res.errors[0].path).toEqual("security.basicAuth")
  })
})