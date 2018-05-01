// invalid_type_format_pair:
// Schemas need to have properly matching type/format pairs

// snake_case_only:
// Names MUST be lower snake case.
// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting

// no_property_description:
// Properties within schema objects should have descriptions

// description_mentions_json:
// Schema property descriptions should not state that model will be a JSON object

// array_of_arrays:
// Schema properties that are arrays should avoid having items that are also arrays

import each from "lodash/each"
import forIn from "lodash/forIn"
import includes from "lodash/includes"
import snakecase from "lodash/snakeCase"

import defaults from "../../../../../.defaultsForValidator"

export function validate({ jsSpec }, config) {
  let errors = []
  let warnings = []

  let schemas = []

  // maintain browser functionality
  // if no object is passed in, set to default
  if (typeof config === "undefined") {
    config = defaults
  }

  config = config.schemas

  if(jsSpec.definitions) {
    each(jsSpec.definitions, (def, name) => {
      if (name.slice(0,2) === "x-") return
      schemas.push({ schema: def, path: ["definitions", name] })
    })
  }

  if(jsSpec.responses) {
    each(jsSpec.responses, (response, name) => {
      if (name.slice(0,2) === "x-") return
      if(response.schema && !response.schema.$ref) {
        schemas.push({ schema: response.schema, path: ["responses", name, "schema"] })
      }
    })
  }

  if(jsSpec.paths) {
    each(jsSpec.paths, (path, pathName) => {
      if (pathName.slice(0,2) === "x-") return
      each(path, (op, opName) => {
        // skip schemas within operations that are excluded
        if (opName.slice(0,2) === "x-") return
        if (op["x-sdk-exclude"] === true) {
          return
        }
        if(op && op.parameters) {
          op.parameters.forEach((parameter, parameterIndex) => {
            if(parameter.in === "body" && parameter.schema && ! parameter.schema.$ref) {
              schemas.push({
                schema: parameter.schema,
                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"]
              })
            }
          })
        }
        if(op && op.responses) {
          each(op.responses, (response, responseName) => {
            if (responseName.slice(0,2) === "x-") return
            if(response && response.schema && !response.schema.$ref) {
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
    let res = generateFormatErrors(schema, path, config)
    errors.push(...res.error)
    warnings.push(...res.warning)

    res = generateDescriptionWarnings(schema, path, config)
    errors.push(...res.error)
    warnings.push(...res.warning)

    let checkStatus = config.snake_case_only
    if (checkStatus !== "off") {
      res = checkPropNames(schema, path, config)
      errors.push(...res.error)
      warnings.push(...res.warning)
    }
  })

  return { errors, warnings }
}

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath, config) {
  let result = {}
  result.error = []
  result.warning = []

  if(!schema.properties) { return result }

  forIn( schema.properties, (property, propName) => {
    if (property.$ref || propName.slice(0,2) === "x-") return
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
        if (property.items) {
          if (property.items.type === "array") {
            let message = "Array properties should avoid having items of type array."
            let checkStatus = config.array_of_arrays
            if (checkStatus !== "off") {
              result[checkStatus].push({ path, message })
            }
          } else {
            valid = formatValid(property.items)
          }
        }
        break
      case "object":
        valid = true // TODO: validate nested schemas
        break
      case null:
        valid = true // Not valid, but should be flagged because type is required
        break
      default:
        valid = false
    }

    if (!valid) {
      let message = "Properties must use well defined property types."
      let checkStatus = config.invalid_type_format_pair
      if (checkStatus !== "off") {
        result[checkStatus].push({
          path,
          message
        })
      }
    }
  })

  return result
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
      valid = (property.format === undefined) // No valid formats for boolean -- should be omitted
      break
    case "object":
      valid = true // TODO: validate nested schemas
      break
    default:
      valid = false
  }
  return valid
}

// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#models
function generateDescriptionWarnings(schema, contextPath, config) {

  let result = {}
  result.error = []
  result.warning = []

  if(!schema.properties) { return result }

  // verify that every property of the model has a description
  forIn( schema.properties, (property, propName) => {

    // if property is defined by a ref, it does not need a description
    if (property.$ref || propName.slice(0,2) === "x-") return

    var path = contextPath.concat(["properties", propName, "description"])

    let hasDescription = property.description && property.description.toString().trim().length
    if (!hasDescription) {
      let message = "Schema properties must have a description with content in it."
      let checkStatus = config.no_property_description
      if (checkStatus !== "off") {
        result[checkStatus].push({
          path,
          message
        })
      }
    }
    else {
      // if the property does have a description, "Avoid describing a model as a 'JSON object' since this will be incorrect for some SDKs."
      let mentionsJSON = includes(property.description.toLowerCase(), "json")
      if (mentionsJSON) {
        let message = "Not all languages use JSON, so descriptions should not state that the model is a JSON object."
        let checkStatus = config.description_mentions_json
        if (checkStatus !== "off") {
          result[checkStatus].push({
            path,
            message
          })
        }
      }
    }
  })

  return result
}

// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting
function checkPropNames(schema, contextPath, config) {

  let result = {}
  result.error = []
  result.warning = []

  if (!schema.properties) { return result }

  // flag any property whose name is not "lower snake case"
  forIn( schema.properties, (property, propName) => {
    if (propName.slice(0,2) === "x-") return

    let checkStatus = config.snake_case_only || "off"
    if (checkStatus.match("error|warning")) {
      let isSnakecase = propName == snakecase(propName)
      if (!isSnakecase) {
        result[checkStatus].push({
           path: contextPath.concat(["properties", propName]),
           message: "Property names must be lower snake case."
        })
      }
    }
  })

  return result
}
