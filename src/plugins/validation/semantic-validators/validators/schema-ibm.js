import each from "lodash/each"
import forIn from "lodash/forIn"
import includes from "lodash/includes"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  //debugger

  let schemas = []

  if(resolvedSpec.definitions) {
    each(resolvedSpec.definitions, (def, name) => {
      def.name = name
      schemas.push({ schema: def, path: ["definitions", name] })
    })
  }

  if(resolvedSpec.responses) {
    each(resolvedSpec.responses, (response, name) => {
      if(response.schema && !response.schema.$$ref) {
        schemas.push({ schema: response.schema, path: ["responses", name, "schema"] })
      }
    })
  }

  if(resolvedSpec.paths) {
    each(resolvedSpec.paths, (path, pathName) => {
      each(path, (op, opName) => {
        if(op && op.parameters) {
          op.parameters.forEach((parameter, parameterIndex) => {
            if(parameter.in === "body" && parameter.schema && ! parameter.schema.$$ref) {
              schemas.push({
                schema: parameter.schema,
                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"]
              })
            }
          })
        }
        if(op && op.responses) {
          each(op.responses, (response, responseName) => {
            if(response && response.schema && !response.schema.$$ref) {
              schemas.push({
                schema: response.schema,
                path: ["paths", pathName, opName, "responses", responseName, "schema"]
              })
            }
          })
        }
      })
    })
  }

  schemas.forEach(({ schema, path }) => {
    errors.push(...generateFormatErrors(schema, path))
  })

  return { errors, warnings }
}

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath) {
  let arr = []

  if(!schema.properties) { return arr }

  forIn( schema.properties, (property, propName) => {
    if (property.$ref) { return }
    var path = contextPath.concat(["properties",propName,"type"])
    var valid = true
    switch (property.type) {
      case "integer":
      case "number":
      case "string":
      case "boolean":
        valid = formatValid(property)
        break
      case "array":
        path = contextPath.concat(["properties",propName,"items","type"])
        valid = formatValid(property.items)
        break
      case "object":
        valid = true   // TODO: validate nested schemas
        break
      default:
        valid = false
    }

    if (!valid) {
      arr.push({
        path: path,
        message: "Properties must use well defined property types."
      })
    }
  })

  return arr
}

function formatValid(property) {
  if (property.$ref) { return true }
  var valid = true
  switch (property.type) {
    case "integer":
      valid = (!property.format) || includes(["int32","int64"], property.format.toLowerCase())
      break
    case "number":
      valid = (!property.format) || includes(["float","double"], property.format.toLowerCase())
      break
    case "string":
      valid = (!property.format) || includes(["byte","binary","date","date-time","password"], property.format.toLowerCase())
      break
    case "boolean":
      valid = (property.format === undefined)   // No valid formats for boolean -- should be omitted
      break
    case "object":
      valid = true   // TODO: validate nested schemas
      break
    default:
      valid = false
  }
  return valid
}
