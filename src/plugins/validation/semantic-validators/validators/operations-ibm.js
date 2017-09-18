
import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import includes from "lodash/includes"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  map(resolvedSpec.paths,
    (path, pathKey) => {
      let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
      each(pathOps, (op, opKey) => {

        if(includes(["put","post"], opKey.toLowerCase())) {

          if(!op.consumes || op.consumes.length === 0 || !op.consumes.toString().trim()) {
            errors.push({
              path: `paths.${pathKey}.${opKey}.consumes`,
              message: "Operations with put and post must have a consumes with content."
            })
          }
        }

        if (opKey.toLowerCase() === "get" && op.consumes) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.consumes`,
            message: "Operations with get should not specify consumes."
          })
        }

        // if(op.description && includes(op.description.toLowerCase(), "json")) {
        //   debugger
        //   warnings.push({
        //     path: `paths.${pathKey}.${opKey}.description`,
        //     message: "Descriptions should not state that the model is a JSON object."
        //   })
        // }

        if( op.summary === "Creates list of users with given input array") {
          // debugger
        }

        if(!op.operationId || op.operationId.length === 0 || !op.operationId.toString().trim()) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.operationId`,
            message: "Operations must have an operationId with value."
          })
        }

        if(op.summary && ((op.summary.length === 0) || (!op.summary.toString().trim()))) {
            errors.push({
              path: `paths.${pathKey}.${opKey}.summary`,
              message: "Operations must have a summary with content."
            })
          }
      })
    })

  return { errors, warnings }
}
