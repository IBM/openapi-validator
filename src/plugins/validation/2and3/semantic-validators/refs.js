// Assertation 1:
// Referenceable definitions should be used by being referenced in the appropriate way

import uniq from "lodash/uniq"
import filter from "lodash/filter"
import startsWith from "lodash/startsWith"
import each from "lodash/each"

export function validate({ jsSpec , specStr, isOAS3 }) {
  let errors = []
  let warnings = []

  if (isOAS3 && !jsSpec.components) {
    // prevent trying to access components.schemas if components is undefined
    return { errors, warnings }
  }

  const basePath = isOAS3 ? ["components", "schemas"] : ["definitions"]

  // Assertation 1
  // This is a "creative" way to approach the problem of collecting used $refs,
  // but other solutions required walking the jsSpec recursively to detect $refs,
  // which can be quite slow.
  let refRegex = /\$ref.*["'](.*)["']/g
  let match = refRegex.exec(specStr)
  let refs = []
  while(match !== null) {
      refs.push(match[1])
      match = refRegex.exec(specStr)
  }

  // de-dupe the array, and filter out non-definition refs
  let definitionsRefs = filter(uniq(refs), v => startsWith(v, `#/${basePath.join("/")}`))

  const definitions = isOAS3 ? jsSpec.components.schemas : jsSpec.definitions
  each(definitions, (def, defName) => {
    if(definitionsRefs.indexOf(`#/${basePath.join("/")}/${defName}`) === -1) {
      warnings.push({
        path: `${basePath.join(".")}.${defName}`,
        message: "Definition was declared but never used in document"
      })
    }
  })

  return { errors, warnings }
}
