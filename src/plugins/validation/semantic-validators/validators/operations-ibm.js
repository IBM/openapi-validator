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

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  map(jsSpec.paths, (path, pathKey) => {
    let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
    each(pathOps, (op, opKey) => {
      if(includes(["put","post"], opKey.toLowerCase())) {

        let hasLocalConsumes = op.consumes && op.consumes.length > 0 && !!op.consumes.join("").trim()
        let hasGlobalConsumes = !!jsSpec.consumes

        if(!hasLocalConsumes && !hasGlobalConsumes) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.consumes`,
            message: "PUT and POST operations must have a non-empty `consumes` field."
          })
        }
      }

      let isGetOperation = opKey.toLowerCase() === "get"
      if (isGetOperation) {

        // get operations should not have a consumes property
        if (op.consumes) {
          warnings.push({
            path: `paths.${pathKey}.${opKey}.consumes`,
            message: "GET operations should not specify a consumes field."
          })
        }

        // get operations should have a produces property
        let hasLocalProduces = op.produces && op.produces.length > 0 && !!op.produces.join("").trim()
        let hasGlobalProduces = !!jsSpec.produces

        if (!hasLocalProduces && !hasGlobalProduces) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.produces`,
            message: "GET operations must have a non-empty `produces` field."
          })
        }
      }


      let hasOperationId = op.operationId && op.operationId.length > 0 && !!op.operationId.toString().trim()
      if(!hasOperationId) {
        warnings.push({
          path: `paths.${pathKey}.${opKey}.operationId`,
          message: "Operations must have a non-empty `operationId`."
        })
      }

      let hasSummary = op.summary && op.summary.length > 0 && !!op.summary.toString().trim()
      if (!hasSummary) {
        warnings.push({
          path: `paths.${pathKey}.${opKey}.summary`,
          message: "Operations must have a non-empty `summary` field."
        })
      }
    })
  })

  return { errors, warnings }
}
