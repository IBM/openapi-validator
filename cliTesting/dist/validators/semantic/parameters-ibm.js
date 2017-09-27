"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Assertation 1:
// The description, when present, should not be empty or contain empty space

// Assertation 2:
// Objects within the 'properties' object in 'definitions' should have a description

// Assertation 3:
// Descriptions should not state that model will be a JSON object

// Assertation 4:
// Parameters must have descriptions, and parameter names must be snake_case

// Assertation 5:
// If parameters define their own format, they must follow the formatting rules.

exports.validate = validate;

var _snakeCase = require("lodash/snakeCase");

var _snakeCase2 = _interopRequireDefault(_snakeCase);

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  function walk(obj, path) {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
      return;
    }

    var isInDefinitions = path[0] === "definitions";
    var contentsOfPropertiesObject = path[path.length - 2] === "properties";
    var childOfItemsObject = path[path.length - 3] === "items";
    var isRef = !!obj.$ref;

    // conditions:
    // in the definitions section
    // obj is a properties object
    // obj is not a sub-object of an items list
    // obj is not defined by a ref
    var conditionsMet = isInDefinitions && contentsOfPropertiesObject && !childOfItemsObject && !isRef;
    if (conditionsMet && !obj.description) {
      //console.log(jsSpec.definitions.Pet);
      warnings.push({
        path: path,
        message: "Properties must have a description with content in it."
      });
    }

    var mentionsJSON = obj.description && obj.description.toLowerCase !== undefined && (0, _includes2.default)(obj.description.toLowerCase(), "json");
    if (mentionsJSON) {
      warnings.push({
        path: path,
        message: "Descriptions should not state that the model is a JSON object."
      });
    }

    var contentsOfParameterObject = path[path.length - 2] === "parameters";

    // obj is a parameter object
    if (contentsOfParameterObject) {

      if (!obj.description) {
        errors.push({
          path: path,
          message: "Parameters with a description must have content in it."
        });
      }

      var isParameter = obj.in; // the `in` property is required by OpenAPI for parameters - this should be true
      var isHeaderParameter = obj.in == "header"; // header params need not be snake_case
      var isSnakecase = obj.name == (0, _snakeCase2.default)(obj.name);

      // if the parameter is defined by a ref, no need to check the ref path for snake_case
      if (isParameter && !isHeaderParameter && !isRef && !isSnakecase) {
        warnings.push({
          path: path,
          message: "Parameter name must use snake case."
        });
      }

      var valid = true;
      if (obj.format && !obj.$ref) {
        switch (obj.type) {
          case "integer":
            valid = (0, _includes2.default)(["int32", "int64"], obj.format.toLowerCase());
            break;
          case "string":
            valid = (0, _includes2.default)(["byte", "date", "date-time", "password"], obj.format.toLowerCase());
            break;
          case "number":
            valid = (0, _includes2.default)(["float", "double"], obj.format.toLowerCase());
            break;
          case "boolean":
            valid = false;
            break;
          default:
            valid = true;
        }
      }

      if (!valid) {
        errors.push({
          path: path,
          message: "Incorrect Format of " + obj.format + " with Type of " + obj.type + " and Description of " + obj.description
        });
      }
    }
    if (Object.keys(obj).length) {
      return Object.keys(obj).map(function (k) {
        return walk(obj[k], [].concat(_toConsumableArray(path), [k]));
      });
    } else {
      return null;
    }
  }

  walk(jsSpec, []);
  return { errors: errors, warnings: warnings };
}