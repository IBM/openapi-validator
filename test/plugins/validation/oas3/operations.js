import expect from "expect"
import { validate } from "../../../../src/plugins/validation/oas3/semantic-validators/operations"

describe("validation plugin - semantic - operations - oas3", function() {
  it("should complain about a request body not having a content field", function() {

    const config = {
      "operations" : {
        "no_request_body_content": "error"
      }
    }

    const spec = {
      paths: {
        "/pets": {
          post: {
            summary: "this is a summary",
            operationId: "operationId",
            requestBody: {
              description: "body for request"
            }
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual("paths./pets.post.requestBody")
    expect(res.errors[0].message).toEqual("Request bodies MUST specify a `content` property")
    expect(res.warnings.length).toEqual(0)
  })
})