import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/operations-ibm"

describe("validation plugin - semantic - operations-ibm", function(){

  it("should complain about a missing consumes with content", function(){

    const config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.put.consumes"])
    expect(res.errors[0].message).toEqual("PUT and POST operations must have a non-empty `consumes` field.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should complain about an empty consumes", function(){

    const config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          post: {
            consumes: [" "],
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.post.consumes"])
    expect(res.errors[0].message).toEqual("PUT and POST operations must have a non-empty `consumes` field.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not complain about a missing consumes when there is a global consumes", function(){

    const config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error"
      }
    }

    const spec = {
      consumes: ["text/plain"],
      paths: {
        "/CoolPath": {
          put: {
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "NotABadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should complain about a get operation having consumes", function(){

    const config = {
      "operations" : {
        "get_op_has_consumes": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            consumes: ["application/json"],
            produces: ["application/json"],
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "Parameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths./CoolPath.get.consumes"])
    expect(res.warnings[0].message).toEqual("GET operations should not specify a consumes field.")
    expect(res.errors.length).toEqual(0)
  })

  it("should complain about a get operation not having produces", function(){

    const config = {
      "operations" : {
        "no_produces_for_get": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "Parameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.get.produces"])
    expect(res.errors[0].message).toEqual("GET operations must have a non-empty `produces` field.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not complain about a missing produces when there is a global produces", function(){

    const config = {
      "operations" : {
        "no_produces_for_get": "error"
      }
    }

    const spec = {
      produces: ["application/json"],
      paths: {
        "/CoolPath": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            parameters: [{
              name: "Parameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [
                  {
                    name: "Property"
                  }
                ]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should complain about a missing operationId", function(){

    const config = {
      "operations" : {
        "no_operation_id": "warning"
      }
    }
    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            consumes: ["consumes"],
            summary: "this is a summary",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

   let res = validate({ jsSpec: spec }, config)
   expect(res.warnings.length).toEqual(1)
   expect(res.warnings[0].path).toEqual(["paths./CoolPath.put.operationId"])
   expect(res.warnings[0].message).toEqual("Operations must have a non-empty `operationId`.")
   expect(res.errors.length).toEqual(0)
  })

  it("should complain about an empty operationId", function(){

    const config = {
      "operations" : {
        "no_operation_id": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            consumes: ["consumes"],
            summary: "this is a summary",
            operationId: " ",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths./CoolPath.put.operationId"])
    expect(res.warnings[0].message).toEqual("Operations must have a non-empty `operationId`.")
    expect(res.errors.length).toEqual(0)
  })

  it("should complain about a missing summary", function(){

    const config = {
      "operations" : {
        "no_summary": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            consumes: ["consumes"],
            operationId: "operationId",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

   let res = validate({ jsSpec: spec }, config)
   expect(res.warnings.length).toEqual(1)
   expect(res.warnings[0].path).toEqual(["paths./CoolPath.put.summary"])
   expect(res.warnings[0].message).toEqual("Operations must have a non-empty `summary` field.")
   expect(res.errors.length).toEqual(0)
  })

  it("should complain about an empty summary", function(){

    const config = {
      "operations" : {
        "no_summary": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            consumes: ["consumes"],
            summary: "  ",
            operationId: "operationId",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths./CoolPath.put.summary"])
    expect(res.warnings[0].message).toEqual("Operations must have a non-empty `summary` field.")
    expect(res.errors.length).toEqual(0)
  })

  it("should not complain about anything when x-sdk-exclude is true", function(){

    const config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          put: {
            "x-sdk-exclude": true,
            summary: "  ",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(0)
    expect(res.errors.length).toEqual(0)
  })

  it("should complain about an anonymouse array response model", function(){

    const config = {
      "operations" : {
        "no_array_responses": "warning"
      }
    }

    const spec = {
      paths: {
        "/stuff": {
          get: {
            summary: "list stuff",
            operationId: "listStuff",
            produces: ["application/json"],
            responses: {
              200: {
                description: "successful operation",
                schema: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths./stuff.get.responses.200.schema"])
    expect(res.warnings[0].message).toEqual("Arrays MUST NOT be returned as the top-level structure in a response body.")
    expect(res.errors.length).toEqual(0)
  })

  it("should complain about an empty summary", function(){

    const config = {
      "operations" : {
        "no_summary": "warning"
      }
    }

    const spec = {
      paths: {
        "/CoolPath": {
          "x-vendor-put-op": {
            consumes: ["consumes"],
            summary: "  ",
            operationId: "operationId",
            parameters: [{
              name: "BadParameter",
              in: "body",
              schema: {
                required: ["Property"],
                properties: [{
                  name: "Property"
                }]
              }
            }]
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(0)
    expect(res.errors.length).toEqual(0)
  })
})
