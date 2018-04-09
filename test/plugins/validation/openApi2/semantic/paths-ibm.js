/* eslint-env mocha */
import expect from "expect"
import { validate } from "../../../../../src/plugins/validation/openApi2/semantic-validators/validators/paths-ibm"

describe("validation plugin - semantic - paths-ibm", function(){

  it("should return an error when a path parameter is not correctly defined in an operation", function(){

    const config = {
      "paths" : {
        "missing_path_parameter": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath/{id}": {
          get: {
            parameters:
            [
              {
                name: "id",
                in: "path",
                description: "good parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          },
          post: {
            parameters: 
            [
              {
                name: "id",
                in: "body",
                description: "bad parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec }, config)
    expect(res.errors.length).toEqual(1)
    expect(res.warnings.length).toEqual(0)
    expect(res.errors[0].path).toEqual("paths./CoolPath/{id}.post.parameters")
    expect(res.errors[0].message).toEqual("Operation must include a parameter with {in: 'path'} and {name: 'id'}")
  })

  it("should not return an error for a missing path parameter when a path defines a global parameter", function(){

    const config = {
      "paths" : {
        "missing_path_parameter": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath/{id}": {
          parameters:
          [
            {
              name: "id",
              in: "path",
              description: "good global parameter",
              required: true,
              type: "integer",
              "format": "int64"
            }
          ],
          get: {
            parameters:
            [
              {
                name: "id",
                in: "path",
                description: "good overriding parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          },
          post: {
            parameters: 
            [
              {
                name: "id",
                in: "body",
                description: "bad parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when incorrect path parameter is in an excluded operation", function(){

    const config = {
      "paths" : {
        "missing_path_parameter": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath/{id}": {
          get: {
            parameters:
            [
              {
                name: "id",
                in: "path",
                description: "good parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          },
          post: {
            "x-sdk-exclude": true,
            parameters: 
            [
              {
                name: "id",
                in: "body",
                description: "bad parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })

  it("should not return an error when incorrect path parameter is in a vendor extension", function(){

    const config = {
      "paths" : {
        "missing_path_parameter": "error"
      }
    }

    const spec = {
      paths: {
        "/CoolPath/{id}": {
          get: {
            parameters:
            [
              {
                name: "id",
                in: "path",
                description: "good parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          },
          "x-vendor-post": {
            parameters: 
            [
              {
                name: "id",
                in: "body",
                description: "bad parameter",
                required: true,
                type: "integer",
                "format": "int64"
              }
            ]
          }
        }
      }
    }

    let res = validate({ resolvedSpec: spec }, config)
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })
})
