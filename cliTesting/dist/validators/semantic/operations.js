"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _pick = require("lodash/pick");

var _pick2 = _interopRequireDefault(_pick);

var _map = require("lodash/map");

var _map2 = _interopRequireDefault(_map);

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

var _findIndex = require("lodash/findIndex");

var _findIndex2 = _interopRequireDefault(_findIndex);

var _findLastIndex = require("lodash/findLastIndex");

var _findLastIndex2 = _interopRequireDefault(_findLastIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(_ref) {
  var resolvedSpec = _ref.resolvedSpec;

  var errors = [];
  var warnings = [];

  (0, _map2.default)(resolvedSpec.paths, function (path, pathKey) {
    var pathOps = (0, _pick2.default)(path, ["get", "head", "post", "put", "patch", "delete", "options"]);
    (0, _each2.default)(pathOps, function (op, opKey) {

      if (!op) {
        return;
      }

      // Assertation 1
      var bodyParamIndex = (0, _findIndex2.default)(op.parameters, ["in", "body"]);
      var formDataParamIndex = (0, _findIndex2.default)(op.parameters, ["in", "formData"]);
      if (bodyParamIndex > -1 && formDataParamIndex > -1) {
        errors.push({
          path: "paths." + pathKey + "." + opKey + ".parameters",
          message: "Operations cannot have both a \"body\" parameter and \"formData\" parameter"
        });
      }
      // Assertation 2
      var lastBodyParamIndex = (0, _findLastIndex2.default)(op.parameters, ["in", "body"]);
      if (bodyParamIndex !== lastBodyParamIndex) {
        errors.push({
          path: "paths." + pathKey + "." + opKey + ".parameters",
          message: "Operations must have no more than one body parameter"
        });
      }

      // Assertation 3
      (0, _each2.default)(op.parameters, function (param, paramIndex) {
        var nameAndInComboIndex = (0, _findIndex2.default)(op.parameters, { "name": param.name, "in": param.in });
        // comparing the current index against the first found index is good, because
        // it cuts down on error quantity when only two parameters are involved,
        // i.e. if param1 and param2 conflict, this will only complain about param2.
        // it also will favor complaining about parameters later in the spec, which
        // makes more sense to the user.
        if (paramIndex !== nameAndInComboIndex) {
          errors.push({
            path: "paths." + pathKey + "." + opKey + ".parameters[" + paramIndex + "]",
            message: "Operation parameters must have unique 'name' + 'in' properties"
          });
        }
      });
    });
  });

  return { errors: errors, warnings: warnings };
} // Assertation 1: Operations cannot have both a 'body' parameter and a 'formData' parameter.
// Assertation 2: Operations must have only one body parameter.
// Assertation 3: Operations must have unique (name + in combination) parameters.