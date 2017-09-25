"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Assertation 1:
// The description, when present, should not be empty or contain empty space

// Walks an entire spec.


exports.validate = validate;

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  function walk(value, path) {

    if (value === null) {
      return null;
    }

    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") {
      return null;
    }

    var keys = Object.keys(value);

    if (keys.length) {
      return keys.map(function (k) {
        if (k === "description" && !(0, _includes2.default)(path, "examples")) {
          var descriptionValue = value["description"].toString();
          if (descriptionValue.length === 0 || !descriptionValue.trim()) {
            errors.push({
              path: path.concat([k]),
              message: "Items with a description must have content in it."
            });
          }
        }
        return walk(value[k], [].concat(_toConsumableArray(path), [k]));
      });
    } else {
      return null;
    }
  }

  walk(jsSpec, []);

  return { errors: errors, warnings: warnings };
}