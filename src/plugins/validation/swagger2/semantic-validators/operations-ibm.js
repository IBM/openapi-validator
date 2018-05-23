// Assertation 1:
// PUT and POST operations must have a non-empty `consumes` field

// Assertation 2:
// GET operations should not specify a consumes field.

// Assertation 3:
// GET operations must have a non-empty `produces` field.

import each from "lodash/each"
import includes from "lodash/includes"
import map from "lodash/map"
import pick from "lodash/pick"

export function validate({ jsSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

  config = config.operations

  map(jsSpec.paths, (path, pathKey) => {
    if (pathKey.slice(0,2) === "x-") {
      return
    }
    let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
    each(pathOps, (op, opKey) => {

      // if operation is excluded, don't validate it
      if (!op || op["x-sdk-exclude"] === true) {
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
    })
  })

  return { errors: result.error, warnings: result.warning }
}
