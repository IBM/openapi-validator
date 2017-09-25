"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

var _forIn = require("lodash/forIn");

var _forIn2 = _interopRequireDefault(_forIn);

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Assertation 1:
// Schemas need to have properly matching type/format pairs

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  var schemas = [];

  if (jsSpec.definitions) {
    (0, _each2.default)(jsSpec.definitions, function (def, name) {
      def.name = name;
      schemas.push({ schema: def, path: ["definitions", name] });
    });
  }

  if (jsSpec.responses) {
    (0, _each2.default)(jsSpec.responses, function (response, name) {
      if (response.schema && !response.schema.$ref) {
        schemas.push({ schema: response.schema, path: ["responses", name, "schema"] });
      }
    });
  }

  if (jsSpec.paths) {
    (0, _each2.default)(jsSpec.paths, function (path, pathName) {
      (0, _each2.default)(path, function (op, opName) {
        if (op && op.parameters) {
          op.parameters.forEach(function (parameter, parameterIndex) {
            if (parameter.in === "body" && parameter.schema && !parameter.schema.$ref) {
              schemas.push({
                schema: parameter.schema,
                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"]
              });
            }
          });
        }
        if (op && op.responses) {
          (0, _each2.default)(op.responses, function (response, responseName) {
            if (response && response.schema && !response.schema.$ref) {
              schemas.push({
                schema: response.schema,
                path: ["paths", pathName, opName, "responses", responseName, "schema"]
              });
            }
          });
        }
      });
    });
  }

  schemas.forEach(function (_ref2) {
    var schema = _ref2.schema,
        path = _ref2.path;

    errors.push.apply(errors, _toConsumableArray(generateFormatErrors(schema, path)));
  });

  return { errors: errors, warnings: warnings };
}

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath) {
  var arr = [];

  if (!schema.properties) {
    return arr;
  }

  (0, _forIn2.default)(schema.properties, function (property, propName) {
    if (property.$ref) {
      return;
    }
    var path = contextPath.concat(["properties", propName, "type"]);
    var valid = true;
    switch (property.type) {
      case "integer":
      case "number":
      case "string":
      case "boolean":
        valid = formatValid(property);
        break;
      case "array":
        path = contextPath.concat(["properties", propName, "items", "type"]);
        valid = formatValid(property.items);
        break;
      case "object":
        valid = true; // TODO: validate nested schemas
        break;
      default:
        valid = false;
    }

    if (!valid) {
      arr.push({
        path: path,
        message: "Properties must use well defined property types."
      });
    }
  });

  return arr;
}

function formatValid(property) {
  if (property.$ref) {
    return true;
  }
  var valid = true;
  switch (property.type) {
    case "integer":
      valid = !property.format || (0, _includes2.default)(["int32", "int64"], property.format.toLowerCase());
      break;
    case "number":
      valid = !property.format || (0, _includes2.default)(["float", "double"], property.format.toLowerCase());
      break;
    case "string":
      valid = !property.format || (0, _includes2.default)(["byte", "binary", "date", "date-time", "password"], property.format.toLowerCase());
      break;
    case "boolean":
      valid = property.format === undefined; // No valid formats for boolean -- should be omitted
      break;
    case "object":
      valid = true; // TODO: validate nested schemas
      break;
    default:
      valid = false;
  }
  return valid;
}