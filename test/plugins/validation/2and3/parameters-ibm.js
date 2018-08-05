import expect from "expect"
import { validate } from "../../../../src/plugins/validation/2and3/semantic-validators/parameters-ibm"

describe("validation plugin - semantic - parameters-ibm", () => {
  describe("Swagger 2", () => {
    it("should return an error when a parameter does not have a description", () => {
      const config = {
        "parameters" : {
          "no_parameter_description": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "name",
                  "in": "query",
                  "type": "string"
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec }, config)
      expect(res.warnings.length).toEqual(0)
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      expect(res.errors[0].message).toEqual("Parameter objects must have a `description` field.")
    })

    it("should return an error when snake case is not used", () => {

      const config = {
        "parameters" : {
          "snake_case_only": "warning"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "camelCase",
                  "in": "query",
                  "description": "description",
                  "type": "string"
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec }, config)
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(1)
      expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      expect(res.warnings[0].message).toEqual("Parameter name must use snake case.")
    })

    it("should not return a snake case error when \"in\" is set to \"header\" ", () => {

      const config = {
        "parameters" : {
          "snake_case_only": "warning"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "camelCase",
                  "in": "header",
                  "description": "description",
                  "type": "string"
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

    it("should return an error when type does not match format", () => {

      const config = {
        "parameters" : {
          "invalid_type_format_pair": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "good_name",
                  "in": "query",
                  "description": "This is a good description.",
                  "type": "number",
                  "format": "int32"
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec }, config)
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      expect(res.errors[0].message).toEqual("Incorrect Format of int32 with Type of number and Description of This is a good description.")
      expect(res.warnings.length).toEqual(0)
    })

    it("should not complain about anything when x-sdk-exclude is true", () => {

      const config = {
        "parameters" : {
          "no_parameter_description": "error",
          "snake_case_only": "warning",
          "invalid_type_format_pair": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "x-sdk-exclude": true,
              "parameters": [
                {
                  "name": "notAGoodName",
                  "in": "query",
                  "type": "number",
                  "format": "int32"
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

    it("should not validate within extensions", () => {

      const config = {
        "parameters" : {
          "no_parameter_description": "error",
          "snake_case_only": "warning",
          "invalid_type_format_pair": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "x-sdk-extension": {
                "parameters": {
                  "example": [
                    {
                      "name": "notAGoodName",
                      "description": "     ",
                      "in": "query",
                      "type": "number",
                      "format": "int32"
                    }
                  ]
                }
              }
            }
          }
        }
      }

      let res = validate({ jsSpec: spec }, config)
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })

    it("should return an error when a parameter defines a content or accept type ", () => {
      const config = {
        "parameters" : {
          "content_type_parameter": "error",
          "accept_type_parameter": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "name",
                  "in": "query",
                  "type": "string",
                  "description": "good description"
                },
                {
                  "name": "Accept",
                  "in": "header",
                  "description": "bad parameter because it specifies an accept type",
                  "required": false,
                  "type": "string",
                  "enum": [
                    "application/json",
                    "application/octet-stream"
                  ]
                },
                {
                  "name": "content-Type",
                  "in": "header",
                  "required": false,
                  "type": "string",
                  "description": "another bad parameter"
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec }, config)
      expect(res.warnings.length).toEqual(0)
      expect(res.errors.length).toEqual(2)
      expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "1"])
      expect(res.errors[0].message).toEqual("Parameters must not explicitly define `Accept`. Rely on the `produces` field to specify accept-type.")
      expect(res.errors[1].path).toEqual(["paths", "/pets", "get", "parameters", "2"])
      expect(res.errors[1].message).toEqual("Parameters must not explicitly define `Content-Type`. Rely on the `consumes` field to specify content-type.")
    })
  })

  describe("OpenAPI 3", () => {
    it("should return an error when a parameter defines content-type, accept, or authorization", () => {
      const config = {
        "parameters" : {
          "content_type_parameter": "error",
          "accept_type_parameter": "error",
          "authorization_parameter": "warning"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "name",
                  "in": "query",
                  "type": "string",
                  "description": "good description"
                },
                {
                  "name": "ACCEPT",
                  "in": "header",
                  "description": "bad parameter because it specifies an accept type",
                  "required": false,
                  "schema": {
                    "type": "string"
                  }
                },
                {
                  "name": "content-type",
                  "in": "header",
                  "required": false,
                  "schema": {
                    "type": "string"
                  },
                  "description": "another bad parameter"
                },
                {
                  name: "Authorization",
                  "in": "header",
                  "description": "Identity Access Management (IAM) bearer token.",
                  "required": false,
                  "schema": {
                    "type": "string"
                  }
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.warnings.length).toEqual(1)
      expect(res.errors.length).toEqual(2)
      expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "1"])
      expect(res.errors[0].message).toEqual("Parameters must not explicitly define `Accept`. Rely on the `content` field of a response object to specify accept-type.")
      expect(res.errors[1].path).toEqual(["paths", "/pets", "get", "parameters", "2"])
      expect(res.errors[1].message).toEqual("Parameters must not explicitly define `Content-Type`. Rely on the `content` field of a request body or response object to specify content-type.")
      expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "parameters", "3"])
      expect(res.warnings[0].message).toEqual(
        "Parameters must not explicitly define `Authorization`. Rely on the `securitySchemas` and `security` fields to specify authorization methods. This check will be converted to an `error` in an upcoming release."
      )
    })

    it("should return an error when a parameter does not have a description", () => {
      const config = {
        "parameters" : {
          "no_parameter_description": "error"
        }
      }

      const spec = {
        components: {
          parameters: {
            BadParam: {
              in: "query",
              name: "bad_query_param",
              schema: {
                type: "string"
              }
            }
          }
        }
      }

      let res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.warnings.length).toEqual(0)
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["components", "parameters", "BadParam"])
      expect(res.errors[0].message).toEqual("Parameter objects must have a `description` field.")
    })

    it("should return an error when parameter type+format is not well-defined", () => {

      const config = {
        "parameters" : {
          "invalid_type_format_pair": "error"
        }
      }

      const spec = {
        "paths": {
          "/pets": {
            "get": {
              "parameters": [
                {
                  "name": "good_name",
                  "in": "query",
                  "description": "This is a good description.",
                  "schema": {
                    "type": "number",
                    "format": "int32"
                  }
                }
              ]
            }
          }
        }
      }

      let res = validate({ jsSpec: spec, isOAS3: true }, config)
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
      expect(res.errors[0].message).toEqual("Incorrect Format of int32 with Type of number and Description of This is a good description.")
      expect(res.warnings.length).toEqual(0)
    })
  })
})
