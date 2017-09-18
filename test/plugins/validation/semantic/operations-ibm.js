import expect from "expect"
import { validate } from "plugins/validation/semantic-validators/validators/operations-ibm"

describe("validation plugin - semantic - operations-ibm", function(){

  it("should complain about a missing consumes with content", function(){

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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.put.consumes"])
    expect(res.errors[0].message).toEqual("Operations with put and post must have a consumes with content.")
    expect(res.warnings.length).toEqual(0)
  })

  it("should complain about an empty consumes", function(){

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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.post.consumes"])
    expect(res.errors[0].message).toEqual("Operations with put and post must have a consumes with content.")
    expect(res.warnings.length).toEqual(0)
  })

  // this will continue to fail until the jsSpec work is merged in
/*  it("should not complain about a missing consumes when there is a global consumes", function(){

    const spec = {
      consumes: ["text/plain"],
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

    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(0)
    expect(res.warnings.length).toEqual(0)
  })*/

  it("should complain about having consumes with get", function(){

    const spec = {
      paths: {
        "/CoolPath": {
          get: {
            consumes: ["application/json"],
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
    // finish below
    let res = validate({ resolvedSpec: spec })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].path).toEqual(["paths./CoolPath.get.consumes"])
    expect(res.errors[0].message).toEqual("Operations with get should not specify consumes.")
    expect(res.warnings.length).toEqual(0)
  })

  // it("should complain about a missing operationId", function(){
  //
  //   const spec = {
  //     paths: {
  //       "/CoolPath": {
  //         put: {
  //           consumes: ["consumes"],
  //           summary: "this is a summary",
  //           parameters: [{
  //             name: "BadParameter",
  //             in: "body",
  //             schema: {
  //               required: ["Property"],
  //               properties: [
  //                 {
  //                   name: "Property"
  //                 }
  //               ]
  //             }
  //           }]
  //         }
  //       }
  //     }
  //   }
  //
  //   let res = validate({ resolvedSpec: spec })
  //   expect(res.errors.length).toEqual(1)
  //   expect(res.errors[0].path).toEqual(["paths./CoolPath.put"])
  //   expect(res.errors[0].message).toEqual("Operations must have an operationId with value.")
  //   expect(res.warnings.length).toEqual(0)
  // })

  // it("should complain about an empty operationId", function(){
  //
  //   const spec = {
  //     paths: {
  //       "/CoolPath": {
  //         put: {
  //           consumes: ["consumes"],
  //           summary: "this is a summary",
  //           operationId: " ",
  //           parameters: [{
  //             name: "BadParameter",
  //             in: "body",
  //             schema: {
  //               required: ["Property"],
  //               properties: [
  //                 {
  //                   name: "Property"
  //                 }
  //               ]
  //             }
  //           }]
  //         }
  //       }
  //     }
  //   }
  //
  //   let res = validate({ resolvedSpec: spec })
  //   expect(res.errors.length).toEqual(1)
  //   expect(res.errors[0].path).toEqual(["paths./CoolPath.put"])
  //   expect(res.errors[0].message).toEqual("Operations must have an operationId with value.")
  //   expect(res.warnings.length).toEqual(0)
  // })
  //
  // it("should complain about an empty operationId", function(){
  //
  //   const spec = {
  //     paths: {
  //       "/CoolPath": {
  //         put: {
  //           consumes: ["consumes"],
  //           operationId: "operationId",
  //           parameters: [{
  //             name: "BadParameter",
  //             in: "body",
  //             schema: {
  //               required: ["Property"],
  //               properties: [
  //                 {
  //                   name: "Property"
  //                 }
  //               ]
  //             }
  //           }]
  //         }
  //       }
  //     }
  //   }
  //
  //   let res = validate({ resolvedSpec: spec })
  //   expect(res.errors.length).toEqual(1)
  //   expect(res.errors[0].path).toEqual(["paths./CoolPath.put"])
  //   expect(res.errors[0].message).toEqual("Operations must have an operationId with value.")
  //   expect(res.warnings.length).toEqual(0)
  // })
})
