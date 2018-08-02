// Assertation 1: Operations cannot have both a 'body' parameter and a 'formData' parameter.
// Assertation 2: Operations must have only one body parameter.

import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import findIndex from "lodash/findIndex"
import findLastIndex from "lodash/findLastIndex"

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

        // Assertation 1
        let bodyParamIndex = findIndex(op.parameters, ["in", "body"])
        let formDataParamIndex = findIndex(op.parameters, ["in", "formData"])
        if(bodyParamIndex > -1 && formDataParamIndex > -1) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.parameters`,
            message: "Operations cannot have both a \"body\" parameter and \"formData\" parameter"
          })
        }
        // Assertation 2
        let lastBodyParamIndex = findLastIndex(op.parameters, ["in", "body"])
        if(bodyParamIndex !== lastBodyParamIndex) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.parameters`,
            message: "Operations must have no more than one body parameter"
          })
        }
      })
    })

  return { errors, warnings }
}
