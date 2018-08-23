const expect = require("expect")
const { validate } = require("../../../../src/plugins/validation/2and3/semantic-validators/items-required-for-array-objects")

describe("validation plugin - semantic - items required for array objects - Swagger 2", () => {
  it("should return an error when an array header object omits an `items` property", () => {
    const spec = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
      },
      "paths": {
        "/pets": {
          "get": {
            "description": "Returns all pets from the system that the user has access to",
            "responses": {
              "200": {
                "description": "pet response",
                "headers": {
                  "X-MyHeader": {
                    "type": "array"
                  }
                }
              },
              "default": {
                "description": "unexpected error"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "responses", "200", "headers", "X-MyHeader"])
    expect(res.errors[0].message).toEqual("Headers with 'array' type require an 'items' property")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when an array header object has an `items` property", () => {
    const spec = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore"
      },
      "paths": {
        "/pets": {
          "get": {
            "description": "Returns all pets from the system that the user has access to",
            "responses": {
              "200": {
                "description": "pet response",
                "headers": {
                  "X-MyHeader": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              },
              "default": {
                "description": "unexpected error"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a model definition is an array but has no `items` property", () => {
    const spec = {
      definitions: {
        TestObject: {
          type: "array"
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual("definitions.TestObject")
    expect(res.errors[0].message).toEqual("Schema objects with 'array' type require an 'items' property")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a model property is an array but has no `items` property", () => {
    const spec = {
      definitions: {
        TestObject: {
          type: "object",
          properties: {
            arrayProperty: {
              type: "array"
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual("definitions.TestObject.properties.arrayProperty")
    expect(res.errors[0].message).toEqual("Schema objects with 'array' type require an 'items' property")
    expect(res.warnings.length).toEqual(0)
  })
})

describe("validation plugin - semantic - items required for array objects - OpenAPI 3", () => {
  it("should return an error when an array header object omits an `items` property", () => {
    const spec = {
      paths: {
        "/pets": {
          get: {
            description: "Returns all pets from the system that the user has access to",
            responses: {
              "200": {
                description: "pet response",
                headers: {
                  "X-MyHeader": {
                    description: "fake header",
                    schema: {
                      type: "array"
                    }
                  }
                }
              },
              default: {
                description: "unexpected error"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual("paths./pets.get.responses.200.headers.X-MyHeader.schema")
    expect(res.errors[0].message).toEqual("Schema objects with 'array' type require an 'items' property")
    expect(res.warnings.length).toEqual(0)
  })

  it("should return an error when a model does not define a required property", () => {
    const spec = {
      components: {
        schemas: {
          TestObject: {
            type: "object",
            required: ["ImportantProperty"],
            properties: {
              OptionalProperty: {
                type: "string"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual("components.schemas.TestObject.required[0]")
    expect(res.errors[0].message).toEqual("Schema properties specified as 'required' must be defined")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when a model definition is an array and has an `items` property", () => {
    const spec = {
      components: {
        schemas: {
          TestObject: {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })
})
