import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/ibm-parameters"

describe("validation plugin - semantic - parameters", () => {

  it("should return an error when description is empty", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "tags",
                "in": "query",
                "description": " ",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.errors[0].message).toEqual("Parameters with a description must have content in it.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when description contains whitespace", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "tags",
                "in": "query",
                "description": "   ",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.errors[0].message).toEqual("Parameters with a description must have content in it.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when snake case is not used", () => {
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.errors[0].message).toEqual("Parameter name must use snake case.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when JSON is in the description", () => {
    const spec = {
      "paths": {
        "/pets": {
          "get": {
            "parameters": [
              {
                "name": "good_name",
                "in": "query",
                "description": "Please do not put json in the description.",
                "type": "string"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "parameters", "0"])
    expect(res.warnings[0].message).toEqual("Descriptions should not state that the model is a JSON object.")
  })
})
