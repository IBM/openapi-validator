
import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  map(resolvedSpec.paths,
    (path, pathKey) => {
      let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
      each(pathOps, (op, opKey) => {

        if(!op) {
          return
        }

        if(!op.operationId || (op.operationId === 0) || (!op.operationId.trim())) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: "Operations must have a summary with content"
          })
        }

        if(!op.summary || (op.summary === 0) || (!op.summary.trim())) {
            errors.push({
              path: `paths.${pathKey}.${opKey}.summary`,
              message: "Operations must have a summary with content"
            })
          }
      })
    })

  return { errors, warnings }
}
