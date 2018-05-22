/* eslint-env mocha */
import expect from "expect"
import { validate } from "../../../../src/plugins/validation/2and3/semantic-validators/security-ibm"

describe("validation plugin - semantic - security-ibm", function() {

  describe("Swagger 2", function() {
    it("should error on a non-empty array for security object that is not of type oauth2", function() {

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
      expect(res.errors[0].message).toEqual("For security scheme types other than oauth2, the value must be an empty array.")
      expect(res.errors[0].path).toEqual("security.basicAuth")
    })

    it("should not error on a non-empty array for security object of type oauth2", function() {

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
      expect(res.warnings.length).toEqual(0)
    })
  })

  describe("OpenAPI 3", function() {
    it("should error on a non-empty array for security req that is not oauth2 or openIdConnect", function() {
      const config = {
        "security": {
          "invalid_non_empty_security_array": "error"
        }
      }

      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "apikey"
            }
          }
        },
        paths: {
          "/": {
            get: {
              operationId: "secureGet",
              summary: "secure get operation",
              security: [
                {
                  TestAuth: [
                    "read:coolData"
                  ]
                }
              ]
            }
          }
        }
      }

      const res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.errors.length).toEqual(1)
      expect(res.warnings.length).toEqual(0)
      expect(res.errors[0].message).toEqual("For security scheme types other than oauth2 or openIdConnect, the value must be an empty array.")
      expect(res.errors[0].path).toEqual("paths./.get.security.TestAuth")
    })

    it("should not error on a non-empty array for security req that is of type oauth2", function() {
      const config = {
        "security": {
          "invalid_non_empty_security_array": "error"
        }
      }

      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "oauth2",
              flows: {
                implicit: {
                  authorizationUrl: "https://auth.com",
                  scopes: {
                    "write:pets": "write access"
                  }
                },
                password: {
                  tokenUrl: "https://auth.com/token",
                  scopes: {
                    "read:pets": "read access"
                  }
                }
              }
            }
          }
        },
        security: [
          {
            TestAuth: ["read:pets"]
          }
        ]
      }

      const res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

    it("should not error on a non-empty array for security object that is of type openIdConnect", function() {
      const config = {
        "security": {
          "invalid_non_empty_security_array": "error"
        }
      }

      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "openIdConnect",
              openIdConnectUrl: "https://auth.com/openId"
            }
          }
        },
        security: [
          {
            TestAuth: ["read:pets"]
          }
        ]
      }

      const res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })
  })
})
