// Assertation 1. If a path has a parameter, all operations must have a parameter of type
// 'path' and name 'parameterName' ( parameterName matching what is contained in curly brackets -> {} )

export function validate({ resolvedSpec }, config) {

  let result = {}
  result.error = []
  result.warning = []

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

      const path = resolvedSpec.paths[pathName]
      const allowedOperations = [
        "get", "put", "post", "delete", "options", "head", "patch", "trace"
      ]
      const operations = Object.keys(path).filter(
        pathItem => allowedOperations.includes(pathItem)
      )
      
      // paths can have a global parameters object that applies to all operations
      let globalParameters = []
      if (path.parameters) {
        globalParameters = path.parameters
                           .filter(param => param.in.toLowerCase() === "path")
                           .map(param => param.name)
      }

      operations.forEach(opName => {

        const operation = path[opName]

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
        const missingParameters = []

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
              message: `Operation must include ${parameterTerm} with {in: 'path'} and {name: '${missingParameters.join(", ")}'}. Can be at the path level or the operation level.`
            })
          }
        }
      })

      if (!operations.length) {
        let accountsForAllParameters = true
        const missingParameters = []
        parameters.forEach(name => {
          if (!globalParameters.includes(name)) {
            accountsForAllParameters = false
            missingParameters.push(name)
          }
        })
        if (!accountsForAllParameters) {
          const checkStatus = config.missing_path_parameter
          if (checkStatus != "off") {
            const parameterTerm = missingParameters.length > 1 ? "parameters" : "parameter"
            result[checkStatus].push({
              path: `paths.${pathName}`,
              message: `The following ${parameterTerm} must be defined at the path or the operation level: ${missingParameters.join(", ")}`
            })
          }
        }
      }
    }
  })

  return { errors: result.error, warnings: result.warning }
}
