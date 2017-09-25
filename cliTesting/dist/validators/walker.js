"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Walks an entire spec.

// Assertation 1:
// In specific areas of a spec, allowed $ref values are restricted.

// Assertation 2:
// Sibling keys with $refs are not allowed.

exports.validate = validate;

var _matcher = require("matcher");

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  function walk(value, path) {
    var curr = path[path.length - 1];

    if (value === null) {
      return null;
    }

    ///// "type" should always be a string, everywhere.
    if (curr === "type" && ["definitions", "properties"].indexOf(path[path.length - 2]) === -1) {
      if (typeof value !== "string") {
        errors.push({
          path: path,
          message: "\"type\" should be a string"
        });
      }
    }

    ///// Minimums and Maximums

    if (value.maximum && value.minimum) {
      if (greater(value.minimum, value.maximum)) {
        errors.push({
          path: path.concat(["minimum"]),
          message: "Minimum cannot be more than maximum"
        });
      }
    }

    if (value.maxProperties && value.minProperties) {
      if (greater(value.minProperties, value.maxProperties)) {
        errors.push({
          path: path.concat(["minProperties"]),
          message: "minProperties cannot be more than maxProperties"
        });
      }
    }

    if (value.maxLength && value.minLength) {
      if (greater(value.minLength, value.maxLength)) {
        errors.push({
          path: path.concat(["minLength"]),
          message: "minLength cannot be more than maxLength"
        });
      }
    }

    ///// Restricted $refs

    if (curr === "$ref") {
      var refBlacklist = getRefPatternBlacklist(path) || [];
      var matches = (0, _matcher2.default)([value], refBlacklist);

      var humanFriendlyRefBlacklist = refBlacklist.map(function (val) {
        return "\"" + val + "\"";
      }).join(", ");

      if (refBlacklist && refBlacklist.length && matches.length) {
        // Assertation 1
        errors.push({
          path: path,
          message: path[path.length - 2] + " $refs cannot match any of the following: " + humanFriendlyRefBlacklist
        });
      }
    }

    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") {
      return null;
    }

    var keys = Object.keys(value);

    if (keys.length) {
      ///// $ref siblings
      return keys.map(function (k) {
        if (keys.indexOf("$ref") > -1 && k !== "$ref") {
          warnings.push({
            path: path.concat([k]),
            message: "Values alongside a $ref will be ignored."
          });
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

// values are globs!
var unacceptableRefPatterns = {
  responses: ["*#/definitions*", "*#/parameters*"],
  schema: ["*#/responses*", "*#/parameters*"],
  parameters: ["*#/definitions*", "*#/responses*"]
};

var exceptionedParents = ["properties"];

function getRefPatternBlacklist(path) {
  return path.reduce(function (prev, curr, i) {
    var parent = path[i - 1];
    if (unacceptableRefPatterns[curr] && exceptionedParents.indexOf(parent) === -1) {
      return unacceptableRefPatterns[curr];
    } else {
      return prev;
    }
  }, null);
}

function greater(a, b) {
  // is a greater than b?
  return a > b;
}