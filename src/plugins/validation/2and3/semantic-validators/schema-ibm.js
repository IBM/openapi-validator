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

import forIn from "lodash/forIn"
import includes from "lodash/includes"
import snakecase from "lodash/snakeCase"

export function validate({ jsSpec }, config) {
  let errors = []
  let warnings = []

  let schemas = []

  config = config.schemas

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null || obj["x-sdk-exclude"]) {
      return
    }

    // don't walk down examples or extensions
    const current = path[path.length - 1]
    if (current === "example" || current === "examples" || (current && current.slice(0,2) === "x-")) {
      return
    }

    /*
      Collect all schemas for later analysis.  The logic should capture the following:
      - Swagger2
        - Everything in the top-level "definitions" object
        - Properties within all models
        - The schema for all body parameters, 
            both in operations and the top-level "parameters" object
        - The schema for all responses,
            both in operations and the top-level "responses" object
      - OpenAPI 3
        - Everything in the "schemas" section of the top-level "components" object
        - Properties within all models
        - The schema for all parameters (that have a schema),
            both in operations and the "parameters" section of the top-level "components" object
        - The schema for all media type objects (any object within a "content" property)
            This includes responses, request bodies, parameters (with content rather than schema),
            both at the operation level and within the top-level "components" object
    */
    const modelLocations = ["definitions", "schemas", "properties"]
    if (current === "schema" || modelLocations.indexOf(path[path.length - 2]) > -1) {
      schemas.push({schema: obj, path})
    }

    if(Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))
    } else {
      return null
    }
  }

  walk(jsSpec, [])

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

  let properties
  if (schema.properties) {
    properties = schema.properties
  } else if (schema.items && schema.items.properties) {
    properties = schema.items.properties
    contextPath = contextPath.concat(["items"])
  }

  if (!properties) { return result }

  // flag any property whose name is not "lower snake case"
  forIn(properties, (property, propName) => {
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
