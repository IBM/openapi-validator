import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/parameters-ibm"

describe("validation plugin - semantic - parameters-ibm", () => {

  it("should return an error when a parameter does not have a description", () => {
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

    let res = validate({ jsSpec: spec })
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
})
