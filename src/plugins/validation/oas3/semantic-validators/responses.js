// Assertation 1:
// The Responses Object MUST contain at least one response code
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responsesObject

// Assertation 2:
// At least one response "SHOULD be the response for a successful operation call"

export function validate({ jsSpec }, config) {
  let result = {}
  result.error = []
  result.warning = []

  config = config.responses

  function walk(obj, path) {
    if (typeof obj !== "object" || obj === null) {
      return
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1]
    if (current === "example" || current === "examples" || (current && current.slice(0,2) === "x-")) {
      return
    }

    const contentsOfResponsesObject = path[path.length - 1] === "responses"
    const isRef = !!obj.$ref

    if (contentsOfResponsesObject && !isRef) {
      const responseCodes = Object.keys(obj).filter(code => isResponseCode(code))
      if (!responseCodes.length) {
        const message = "Each `responses` object MUST have at least one response code."
        const checkStatus = config.no_response_codes
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
          })
        }
      } else {
        const successCodes = responseCodes.filter(code => code.slice(0,1) === "2")
        if (!successCodes.length) {
          const message = "Each `responses` object SHOULD have at least one code for a successful response."
          const checkStatus = config.no_success_response_codes
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path,
              message
            })
          }
        }
      }
    }

    if (Object.keys(obj).length) {
      return Object.keys(obj).map(k => {
        // ignore validating all extensions - users need to use custom schemas
        if (k.slice(0,2) !== "x-") {
          return walk(obj[k], [...path, k])
        }
      })
    } else {
      return null
    }
  }

  walk(jsSpec, [])
  return { errors: result.error , warnings: result.warning }
}

function isResponseCode(code) {
  const allowedFirstDigits = ["1", "2", "3", "4", "5"]
  return code.length === 3 && allowedFirstDigits.includes(code.slice(0,1))
}
