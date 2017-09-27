"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Assertation 1:
// The items property for a parameter is required when its type is set to array

function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  function walk(obj, path) {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
      return;
    }

    // 1
    if (path[path.length - 2] === "parameters") {
      if (obj.type === "array" && _typeof(obj.items) !== "object") {
        errors.push({
          path: path,
          message: "Parameters with 'array' type require an 'items' property."
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