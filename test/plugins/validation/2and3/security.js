import expect from "expect"
import { validate } from "../../../../src/plugins/validation/2and3/semantic-validators/security"

describe("validation plugin - semantic - security", () => {
  describe("Swagger 2", () => {
    it("should return an error when an operation references a non-existing security scope", () => {
      const spec = {
        "securityDefinitions": {
          "api_key": {
            "type": "apiKey",
            "name": "apikey",
            "in": "query",
            "scopes": {
              "asdf": "blah blah"
            }
          }
        },
        "paths": {
          "/": {
            "get": {
              "description": "asdf",
              "security": [
                {
                  "api_key": [
                    "write:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0", "0"])
      expect(res.errors[0].message).toEqual("Security scope definition write:pets could not be resolved")
      expect(res.warnings.length).toEqual(0)
    })
    it("should return an error when an operation references a security definition with no scopes", () => {
      const spec = {
        "securityDefinitions": {
          "api_key": {
            "type": "apiKey",
            "name": "apikey",
            "in": "query"
          }
        },
        "paths": {
          "/": {
            "get": {
              "description": "asdf",
              "security": [
                {
                  "api_key": [
                    "write:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0", "0"])
      expect(res.errors[0].message).toEqual("Security scope definition write:pets could not be resolved")
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when an operation references a non-existing security definition", () => {
      const spec = {
        "securityDefinitions": {
          "api_key": {
            "type": "apiKey",
            "name": "apikey",
            "in": "query"
          }
        },
        "paths": {
          "/": {
            "get": {
              "description": "asdf",
              "security": [
                {
                  "fictional_security_definition": [
                    "write:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0"])
      expect(res.errors[0].message).toEqual("security requirements must match a security definition")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when an operation references an existing security scope", () => {
      const spec = {
        "securityDefinitions": {
          "api_key": {
            "type": "apiKey",
            "name": "apikey",
            "in": "query",
            "scopes": {
              "write:pets": "write to pets"
            }
          }
        },
        "paths": {
          "/": {
            "get": {
              "description": "asdf",
              "security": [
                {
                  "api_key": [
                    "write:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })
  })

  describe("OpenAPI 3", () => {
    it("should return an error when an operation references a non-existing security scope", () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "oauth2",
              description: "just a test",
              flows: {
                "implicit": {
                  authorizationUrl: "https://example.com/api/oauth",
                  scopes: {
                    "read:pets": "you can read but you can't write"
                  }
                }
              }
            }
          }
        },
        paths: {
          "/": {
            get: {
              description: "asdf",
              security: [
                {
                  TestAuth: [
                    "write:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec, isOAS3: true })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0", "0"])
      expect(res.errors[0].message).toEqual("Security scope definition write:pets could not be resolved")
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when one of a few scopes is undefined", () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "oauth2",
              description: "just a test",
              flows: {
                "implicit": {
                  authorizationUrl: "https://example.com/api/oauth",
                  scopes: {
                    "read:pets": "you can read but you can't write",
                    "read:houses": "you can read but you can't write",
                    "write:houses": "you can write but you can't read"
                  }
                }
              }
            }
          }
        },
        paths: {
          "/": {
            get: {
              description: "asdf",
              security: [
                {
                  TestAuth: [
                    "write:houses",
                    "read:houses",
                    "write:pets",
                    "read:pets"
                  ]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec, isOAS3: true })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].message).toEqual("Security scope definition write:pets could not be resolved")
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0", "2"])
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when a security requirement is undefined", () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "oauth2",
              description: "just a test",
              flows: {
                "implicit": {
                  authorizationUrl: "https://example.com/api/oauth",
                  scopes: {
                    "read:pets": "you can read but you can't write"
                  }
                }
              }
            }
          }
        },
        paths: {
          "/": {
            get: {
              description: "asdf",
              security: [
                {
                  UndefinedAuth: ["read:pets"]
                }
              ]
            }
          }
        }
      }

      let res = validate({ resolvedSpec: spec, isOAS3: true })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].message).toEqual("security requirements must match a security definition")
      expect(res.errors[0].path).toEqual(["paths", "/", "get", "security", "0"])
      expect(res.warnings.length).toEqual(0)
    })

    it("should not return an error when a security requirement references an existing security scope", () => {
      const spec = {
        components: {
          securitySchemes: {
            TestAuth: {
              type: "oauth2",
              description: "just a test",
              flows: {
                "implicit": {
                  authorizationUrl: "https://example.com/api/oauth",
                  scopes: {
                    "read:pets": "you can read but you can't write"
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

      let res = validate({ resolvedSpec: spec, isOAS3: true })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })
  })
})
