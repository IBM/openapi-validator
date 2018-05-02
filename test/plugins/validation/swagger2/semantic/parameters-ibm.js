import expect from "expect"
import { validate } from "../../../../../src/plugins/validation/swagger2/semantic-validators/validators/parameters-ibm"

describe("validation plugin - semantic - parameters-ibm", () => {

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
