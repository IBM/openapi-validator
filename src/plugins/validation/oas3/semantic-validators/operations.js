// Assertation 1. Request body objects must have a `content` property
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject

import pick from "lodash/pick"
import each from "lodash/each"

export function validate({ resolvedSpec }, config) {

  const result = {}
  result.error = []
  result.warning = []

  console.log(JSON.stringify(config, null, 2))

  const allowedOps =
    ["get", "head", "post", "put", "patch", "delete", "options", "trace"]

  each(resolvedSpec.paths, (path, pathName) => {
    let operations = pick(path, allowedOps)
    each(operations, (op, opName) => {
      if (!op || op["x-sdk-exclude"] === true) {
        return
      }
      // Assertation 1
      if (op.requestBody) {
        const requestBodyContent = op.requestBody.content
        if (!requestBodyContent || !Object.keys(requestBodyContent).length) {
          result.error.push({
            path: `paths.${pathName}.${opName}.requestBody`,
            message: "Request bodies MUST specify a `content` property"
          })
        }
      }
    })
  })



  return { errors: result.error, warnings: result.warning }
}
