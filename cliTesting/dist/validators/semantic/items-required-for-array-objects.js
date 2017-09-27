"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Assertation 1:
// The items property for Schema Objects, or schema-like objects (non-body parameters), is required when type is set to array

// Assertation 2:
// The required properties for a Schema Object must be defined in the object or one of its ancestors.

// Assertation 3:
// The default property for Schema Objects, or schema-like objects (non-body parameters), must validate against the respective JSON Schema


function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  function walk(obj, path) {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
      return;
    }

    if (path[path.length - 1] === "schema" || path[path.length - 2] === "definitions") {
      // if parent is 'schema', or we're in a model definition

      // Assertation 1
      if (obj.type === "array" && _typeof(obj.items) !== "object") {
        errors.push({
          path: path.join("."),
          message: "Schema objects with 'array' type require an 'items' property"
        });
      }

      // Assertation 2
      if (Array.isArray(obj.required)) {
        obj.required.forEach(function (requiredProp, i) {
          if (!obj.properties || !obj.properties[requiredProp]) {
            var pathStr = path.concat(["required[" + i + "]"]).join(".");
            errors.push({
              path: pathStr,
              message: "Schema properties specified as 'required' must be defined"
            });
          }
        });
      }
    }

    if (path[path.length - 2] === "headers") {
      if (obj.type === "array" && _typeof(obj.items) !== "object") {
        errors.push({
          path: path,
          message: "Headers with 'array' type require an 'items' property"
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

  walk(resolvedSpec, []);

  return { errors: errors, warnings: warnings };
}