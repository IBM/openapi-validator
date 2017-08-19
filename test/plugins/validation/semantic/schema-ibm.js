import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/schema-ibm"

describe("validation plugin - semantic - schema", () => {

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

    let res = validate({ resolvedSpec: spec })
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["definitions", "Thing", "properties", "level", "items", "type"])
    expect(res.errors[0].message).toEqual("Properties must use well defined property types.")
    expect(res.warnings.length).toEqual(0)
  })

})
