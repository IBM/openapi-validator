import expect from "expect"
import { validate } from "../../../../src/plugins/validation/2and3/semantic-validators/refs"

describe("validation plugin - semantic - refs", function() {
  describe("Definitions should be referenced at least once in the document", function() {
    it("should warn about an unused definition - Swagger 2", function() {
      const jsSpec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              description: "An id"
            }]
          }
        },
        definitions: {
          SchemaObject: {
            type: "object",
            required: ["id"],
            properties: {
              id: {
                type: "string"
              }
            }
          }
        }
      }

      const specStr = JSON.stringify(jsSpec, null, 2)
      const isOAS3 = false

      const res = validate({ jsSpec, specStr, isOAS3 })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(1)
      expect(res.warnings[0].path).toEqual("definitions.SchemaObject")
      expect(res.warnings[0].message).toEqual("Definition was declared but never used in document")
    })

    it("should warn about an unused definition - OpenAPI 3", function() {
      const jsSpec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              description: "An id"
            }]
          }
        },
        components: {
          schemas: {
            SchemaObject: {
              type: "object",
              required: ["id"],
              properties: {
                id: {
                  type: "string"
                }
              }
            }
          }
        }
      }

      const specStr = JSON.stringify(jsSpec, null, 2)
      const isOAS3 = true

      const res = validate({ jsSpec, specStr, isOAS3 })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(1)
      expect(res.warnings[0].path).toEqual("components.schemas.SchemaObject")
      expect(res.warnings[0].message).toEqual("Definition was declared but never used in document")
    })

    it("should not warn about a used definition - OpenAPI 3", function() {
      const jsSpec = {
        paths: {
          "/CoolPath/{id}": {
            parameters: [{
              name: "id",
              in: "path",
              description: "An id",
              schema: {
                $ref: "#/components/schemas/SchemaObject"
              }
            }]
          }
        },
        components: {
          schemas: {
            SchemaObject: {
              type: "object",
              required: ["id"],
              properties: {
                id: {
                  type: "string"
                }
              }
            }
          }
        }
      }

      const specStr = JSON.stringify(jsSpec, null, 2)
      const isOAS3 = true

      const res = validate({ jsSpec, specStr, isOAS3 })
      expect(res.errors.length).toEqual(0)
      expect(res.warnings.length).toEqual(0)
    })
  })
})