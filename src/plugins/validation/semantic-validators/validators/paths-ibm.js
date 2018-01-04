// Assertation 1. If a path has a parameter, all operations must have a parameter of type
// 'path' and name 'parameterName' ( parameterName matching what is contained in curly brackets -> {} )

import defaults from "../../../../.defaultsForValidator"

export function validate({ resolvedSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.paths

  let pathNames = Object.keys(resolvedSpec.paths)

  pathNames.forEach(pathName => {

    // get all path parameters contained in curly brackets
    let regex = /\{(.*?)\}/g
    let parameters = pathName.match(regex)

    // there are path parameters, check each operation to make sure they are defined
    if (parameters) {

      // parameter strings will still have curly braces around them
      //   from regex match - take them out
      parameters = parameters.map(param => {
        return param.slice(1, -1)
      })

      let path = resolvedSpec.paths[pathName]
      let operations = Object.keys(path)
      
      // paths can have a global parameters object that applies to all operations
      let globalParameters = []
      if (operations.includes("parameters")) {
        globalParameters = path.parameters
                           .filter(param => param.in.toLowerCase() === "path")
                           .map(param => param.name)
      }

      operations.forEach(opName => {

        if (opName === "$ref" || opName === "parameters") {
          return
        }

        let operation = path[opName]

        // ignore validating excluded operations
        if (operation["x-sdk-exclude"] === true) {
          return
        }

        // get array of 'names' for parameters of type 'path' in the operation
        let givenParameters = []
        if (operation.parameters) {
          givenParameters = operation.parameters
                            .filter(param => param.in.toLowerCase() === "path")
                            .map(param => param.name)
        }


        let accountsForAllParameters = true
        let missingParameters = []

        parameters.forEach(name => {
          if (!givenParameters.includes(name) && !globalParameters.includes(name)) {
            accountsForAllParameters = false
            missingParameters.push(name)
          }
        })

        if (!accountsForAllParameters) {
          let checkStatus = config.missing_path_parameter
          if (checkStatus != "off") {
            let parameterTerm = missingParameters.length > 1 ? "parameters" : "a parameter"
            result[checkStatus].push({
              path: `paths.${pathName}.${opName}.parameters`,
              message: `Operation must include ${parameterTerm} with {in: 'path'} and {name: '${missingParameters.join(", ")}'}`
            })
          }
        }
      })
    }
  })

  return { errors: result.error, warnings: result.warning }
}
