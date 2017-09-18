
import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import includes from "lodash/includes"

export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  // check for global consumes
  let globalConsumes = !!jsSpec.consumes

  map(jsSpec.paths,
    (path, pathKey) => {
      let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
      each(pathOps, (op, opKey) => {

        if(includes(["put","post"], opKey.toLowerCase())) {
          if((!op.consumes || op.consumes.length === 0 || !op.consumes.toString().trim()) && !globalConsumes) {
            errors.push({
              path: `paths.${pathKey}.${opKey}.consumes`,
              message: "Operations with put and post must have a consumes with content."
            })
          }
        }     

        if(!op.operationId || op.operationId.length === 0 || !op.operationId.toString().trim()) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: "Operations must have an operationId with value."
          })
        }


        if (op.summary && ((op.summary.length === 0) || (!op.summary.toString().trim()))) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.summary`,
            message: "Operations must have a summary with content."
          })
        }
      })
    })

  return { errors, warnings }
}
