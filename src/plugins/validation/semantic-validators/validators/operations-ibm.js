// Assertation 1:
// PUT and POST operations must have a non-empty `consumes` field

// Assertation 2:
// GET operations should not specify a consumes field.

// Assertation 3:
// GET operations must have a non-empty `produces` field.

// Assertation 4:
// Operations must have a non-empty `operationId`

// Assertation 5:
// Operations must have a non-empty `summary` field.

import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import includes from "lodash/includes"

export function validate({ jsSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = {
      no_consumes_for_put_or_post: "error",
      get_op_has_consumes: "warning",
      no_produces_for_get: "error",
      no_operation_id: "warning",
      no_summary: "warning"
    }
  }
  else {
    config = config.operations
  }

  map(jsSpec.paths, (path, pathKey) => {
    let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
    each(pathOps, (op, opKey) => {

      // if operation is excluded, don't validate it
      if (op["x-sdk-exclude"] === true) {
        // skip this operation in the 'each' loop
        return
      }

      if(includes(["put","post"], opKey.toLowerCase())) {

        let hasLocalConsumes = op.consumes && op.consumes.length > 0 && !!op.consumes.join("").trim()
        let hasGlobalConsumes = !!jsSpec.consumes

        if(!hasLocalConsumes && !hasGlobalConsumes) {
          let checkStatus = config.no_consumes_for_put_or_post
          
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `paths.${pathKey}.${opKey}.consumes`,
              message: "PUT and POST operations must have a non-empty `consumes` field."
            })
          } 
        }
      }

      let isGetOperation = opKey.toLowerCase() === "get"
      if (isGetOperation) {

        // get operations should not have a consumes property
        if (op.consumes) {
          let checkStatus = config.get_op_has_consumes

          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `paths.${pathKey}.${opKey}.consumes`,
              message: "GET operations should not specify a consumes field."
            })
          }
        }

        // get operations should have a produces property
        let hasLocalProduces = op.produces && op.produces.length > 0 && !!op.produces.join("").trim()
        let hasGlobalProduces = !!jsSpec.produces

        if (!hasLocalProduces && !hasGlobalProduces) {
          let checkStatus = config.no_produces_for_get

          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `paths.${pathKey}.${opKey}.produces`,
              message: "GET operations must have a non-empty `produces` field."
            })
          }
        }
      }


      let hasOperationId = op.operationId && op.operationId.length > 0 && !!op.operationId.toString().trim()
      if(!hasOperationId) {

        let checkStatus = config.no_operation_id
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: "Operations must have a non-empty `operationId`."
          })
        }
      }

      let hasSummary = op.summary && op.summary.length > 0 && !!op.summary.toString().trim()
      if (!hasSummary) {

        let checkStatus = config.no_summary
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path: `paths.${pathKey}.${opKey}.summary`,
            message: "Operations must have a non-empty `summary` field."
          })
        }
      }
    })
  })

  return { errors: result.error, warnings: result.warning }
}
