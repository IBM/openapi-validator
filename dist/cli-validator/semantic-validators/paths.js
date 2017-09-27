"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

var _findIndex = require("lodash/findIndex");

var _findIndex2 = _interopRequireDefault(_findIndex);

var _isObject = require("lodash/isObject");

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Assertation 1:
// Path parameters definition, either at the path-level or the operation-level, need matching paramater declarations

// Assertation 2:
// Path parameter declarations do not allow empty names (/path/{} is not valid)

// Assertation 3:
// Path parameters declared in the path string need matching parameter definitions (Either at the path-level or the operation)

// Assertation 4:
// Path strings must be (equivalently) different (Example: /pet/{petId} and /pet/{petId2} are equivalently the same and would generate an error)

// Assertation 5:
// Paths must have unique (name + in combination) parameters

// Assertation 6:
// Paths cannot have partial templates. (/path/abc{123} is illegal)

// Assertation 7:
// Paths cannot have literal query strings in them.

var templateRegex = /\{(.*?)\}/g;

function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  var seenRealPaths = {};

  var tallyRealPath = function tallyRealPath(path) {
    // ~~ is a flag for a removed template string
    var realPath = path.replace(templateRegex, "~~");
    var prev = seenRealPaths[realPath];
    seenRealPaths[realPath] = true;
    // returns if it was previously seen
    return !!prev;
  };

  (0, _each2.default)(resolvedSpec.paths, function (path, pathName) {
    if (!path || !pathName) {
      return;
    }

    pathName.split("/").map(function (substr) {
      // Assertation 6
      if (templateRegex.test(substr) && substr.replace(templateRegex, "").length > 0) {
        errors.push({
          path: "paths." + pathName,
          message: "Partial path templating is not allowed."
        });
      }
    });

    if (pathName.indexOf("?") > -1) {
      errors.push({
        path: "paths." + pathName,
        message: "Query strings in paths are not allowed."
      });
    }

    var parametersFromPath = path.parameters ? path.parameters.slice() : [];

    var availableParameters = parametersFromPath.map(function (param, i) {
      if (!(0, _isObject2.default)(param)) {
        return;
      }
      param.$$path = "paths." + pathName + ".parameters[" + i + "]";
      return param;
    });

    (0, _each2.default)(path, function (thing, thingName) {
      if (thing && thing.parameters) {
        availableParameters.push.apply(availableParameters, _toConsumableArray(thing.parameters.map(function (param, i) {
          if (!(0, _isObject2.default)(param)) {
            return;
          }
          param.$$path = "paths." + pathName + "." + thingName + ".parameters[" + i + "]";
          return param;
        })));
      }
    });

    // Assertation 4
    var hasBeenSeen = tallyRealPath(pathName);
    if (hasBeenSeen) {
      errors.push({
        path: "paths." + pathName,
        message: "Equivalent paths are not allowed."
      });
    }

    // Assertation 5
    (0, _each2.default)(parametersFromPath, function (parameterDefinition, i) {
      var nameAndInComboIndex = (0, _findIndex2.default)(parametersFromPath, { "name": parameterDefinition.name, "in": parameterDefinition.in });
      // comparing the current index against the first found index is good, because
      // it cuts down on error quantity when only two parameters are involved,
      // i.e. if param1 and param2 conflict, this will only complain about param2.
      // it also will favor complaining about parameters later in the spec, which
      // makes more sense to the user.
      if (i !== nameAndInComboIndex && parameterDefinition.in) {
        errors.push({
          path: "paths." + pathName + ".parameters[" + i + "]",
          message: "Path parameters must have unique 'name' + 'in' properties"
        });
      }
    });

    var pathTemplates = pathName.match(templateRegex) || [];
    pathTemplates = pathTemplates.map(function (str) {
      return str.replace("{", "").replace("}", "");
    });

    // Assertation 1
    (0, _each2.default)(availableParameters, function (parameterDefinition, i) {
      if ((0, _isObject2.default)(parameterDefinition) && parameterDefinition.in === "path" && pathTemplates.indexOf(parameterDefinition.name) === -1) {
        errors.push({
          path: parameterDefinition.$$path || "paths." + pathName + ".parameters[" + i + "]",
          message: "Path parameter " + parameterDefinition.name + " was defined but never used"
        });
      }
    });

    if (pathTemplates) {
      pathTemplates.forEach(function (parameter) {
        // Assertation 2

        if (parameter === "") {
          // it was originally "{}"
          errors.push({
            path: "paths." + pathName,
            message: "Empty path parameter declarations are not valid"
          });
        } else

          // Assertation 3
          if ((0, _findIndex2.default)(availableParameters, { name: parameter, in: "path" }) === -1) {
            if ((0, _findIndex2.default)(errors, { path: "paths." + pathName }) > -1) {
              // don't add an error if there's already one for the path (for assertation 6)
              return;
            }
            errors.push({
              path: "paths." + pathName,
              message: "Declared path parameter \"" + parameter + "\" needs to be defined as a path parameter at either the path or operation level"
            });
          }
      });
    } else {
      (0, _each2.default)(availableParameters, function (parameterDefinition, i) {
        // Assertation 1, for cases when no templating is present on the path
        if (parameterDefinition.in === "path") {
          errors.push({
            path: "paths." + pathName + ".parameters[" + i + "]",
            message: "Path parameter " + parameterDefinition.name + " was defined but never used"
          });
        }
      });
    }
  });

  return { errors: errors, warnings: warnings };
}