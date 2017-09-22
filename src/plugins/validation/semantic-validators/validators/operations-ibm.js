// Assertation 1:
// PUT and POST operations must have a non-empty `consumes` field

// Assertation 2:
// Operations must have a non-empty `operationId`

// Assertation 3:
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

      // still need to finish this
      if (opKey.toLowerCase() === "get" && op.consumes) {
        errors.push({
          path: `paths.${pathKey}.${opKey}.consumes`,
          message: "Operations with get should not specify consumes."
        })
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
        errors.push({
          path: `paths.${pathKey}.${opKey}.summary`,
          message: "Operations must have a non-empty `summary` field."
        })
      }
    })
  })

  return { errors, warnings }
}
