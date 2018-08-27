const expect = require("expect")
const { validate } = require("../../../../src/plugins/validation/oas3/semantic-validators/responses")

describe("validation plugin - semantic - responses - oas3", function() {
  it("should complain when response object only has a default", function() {

    const config = {
      "responses" : {
        "no_response_codes": "error",
        "no_success_response_codes": "warning"
      }
    }

    const spec = {
      paths: {
        "/pets": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            responses: {
              default: {
                description: "the default response"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "responses"])
    expect(res.errors[0].message).toEqual("Each `responses` object MUST have at least one response code.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should complain when no response codes are valid", function() {

    const config = {
      "responses" : {
        "no_response_codes": "error",
        "no_success_response_codes": "warning"
      }
    }

    const spec = {
      paths: {
        "/pets": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            responses: {
              "2007": {
                description: "an invalid response"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths", "/pets", "get", "responses"])
    expect(res.errors[0].message).toEqual("Each `responses` object MUST have at least one response code.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should not complain when there are no problems", function() {

    const config = {
      "responses" : {
        "no_response_codes": "error",
        "no_success_response_codes": "warning"
      }
    }

    const spec = {
      paths: {
        "/pets": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            responses: {
              "200": {
                description: "successful operation call"
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

  it("should complain about having only error responses", function() {

    const config = {
      "responses" : {
        "no_response_codes": "error",
        "no_success_response_codes": "warning"
      }
    }

    const spec = {
      paths: {
        "/pets": {
          get: {
            summary: "this is a summary",
            operationId: "operationId",
            responses: {
              "400": {
                description: "bad request"
              },
              "401": {
                description: "unauthorized"
              },
              "404": {
                description: "resource not found"
              }, 
              default: {
                description: "any other response"
              }
            }
          }
        }
      }
    }

    let res = validate({ jsSpec: spec }, config)
    expect(res.warnings.length).toEqual(1)
    expect(res.warnings[0].path).toEqual(["paths", "/pets", "get", "responses"])
    expect(res.warnings[0].message).toEqual("Each `responses` object SHOULD have at least one code for a successful response.")
    expect(res.errors.length).toEqual(0)
  })
})