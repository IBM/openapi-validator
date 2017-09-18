import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/schema-ibm"

describe("validation plugin - semantic - schema-ibm", () => {

  it("should return an error when a property does not use a well defined property type", () => {
    const spec = {
      definitions: {
        WordStyle: {
          type: "object",
          properties: {
            level: {
              type: "number",
              format: "integer"
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["definitions", "WordStyle", "properties", "level", "type"])
    expect(res.errors[0].message).toEqual("Properties must use well defined property types.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when an array property's items does not use a well defined property type", () => {
    const spec = {
      definitions: {
        Thing: {
          type: "object",
          properties: {
            level: {
              type: "array",
              items: {
                type: "number",
                format: "integer"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["definitions", "Thing", "properties", "level", "items", "type"])
    expect(res.errors[0].message).toEqual("Properties must use well defined property types.")
    expect(res.warnings.length).toEqual(0)
  })

  // *****
  // Why does this expect an error when the description says it should not error?
  // This check only passes on the master branch because the resolvedSpec variable
  // is not actually 'resolved' during the testing. The validator checks for '$$ref'
  // but that key only exists in the resolvedSpec. So, an error is thrown because
  // the test sends an object with the key '$ref'
  it("should not error when an array property's items is a ref", () => {
    const spec = {
      definitions: {
        Thing: {
          type: "object",
          properties: {
            level: {
              type: "array",
              items: {
                $ref: "#/definitions/levelItem"
              }
            }
          }
        },
        levelItem: {
          type: "string"
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["definitions", "Thing", "properties", "level", "items", "type"])
    expect(res.errors[0].message).toEqual("Properties must use well defined property types.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a response does not use a well defined property type", () => {
    const spec = {
      responses: {
        Thing: {
          schema: {
            properties: {
              level: {
                type: "number",
                format: "integer"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["responses", "Thing", "schema", "properties", "level", "type"])
    expect(res.errors[0].message).toEqual("Properties must use well defined property types.")
    expect(res.warnings.length).toEqual(0)
  })

})
