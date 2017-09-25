"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Assertation 1:
// Items in `security` must match a `securityDefinition`.


function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  var securityDefinitions = resolvedSpec.securityDefinitions;

  function walk(obj, path) {
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" || obj === null) {
      return;
    }

    if (path[path.length - 2] === "security") {

      // Assertation 1
      Object.keys(obj).map(function (key) {
        var securityDefinition = securityDefinitions && securityDefinitions[key];
        if (!securityDefinition) {
          errors.push({
            message: "security requirements must match a security definition",
            path: path
          });
        }

        if (securityDefinition) {
          var scopes = obj[key];
          if (Array.isArray(scopes)) {

            // Check for unknown scopes

            scopes.forEach(function (scope, i) {
              if (!securityDefinition.scopes || !securityDefinition.scopes[scope]) {
                errors.push({
                  message: "Security scope definition " + scope + " could not be resolved",
                  path: path.concat([i.toString()])
                });
              }
            });
          }
        }
      });
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