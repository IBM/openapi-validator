"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  var schemas = [];

  if (resolvedSpec.definitions) {
    (0, _each2.default)(resolvedSpec.definitions, function (def, name) {
      def.name = name;
      schemas.push({ schema: def, path: ["definitions", name] });
    });
  }

  if (resolvedSpec.paths) {
    (0, _each2.default)(resolvedSpec.paths, function (path, pathName) {
      (0, _each2.default)(path, function (op, opName) {
        if (op && op.parameters) {
          op.parameters.forEach(function (parameter, parameterIndex) {
            if (parameter.in === "body" && parameter.schema) {
              schemas.push({
                schema: parameter.schema,
                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"]
              });
            }
          });
        }
        if (op && op.responses) {
          (0, _each2.default)(op.responses, function (response, responseName) {
            if (response && response.schema) {
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

    if (Array.isArray(schema.properties) && Array.isArray(schema.required)) {
      schema.properties.forEach(function () {
        errors.push.apply(errors, _toConsumableArray(generateReadOnlyErrors(schema, path)));
      });
    }
  });

  return { errors: errors, warnings: warnings };
}

function generateReadOnlyErrors(schema, contextPath) {
  var arr = [];

  schema.properties.forEach(function (property, i) {
    if (property.name && property.readOnly && schema.required.indexOf(property.name) > -1) {
      arr.push({
        path: contextPath.concat(["required", i.toString()]),
        message: "Read only properties cannot marked as required by a schema."
      });
    }
  });
  return arr;
}