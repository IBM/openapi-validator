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

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Assertation 1:
// PUT and POST operations must have a non-empty `consumes` field

// Assertation 2:
// GET operations should not specify a consumes field.

// Assertation 3:
// GET operations must have a non-empty `produces` field.

// Assertation 4:
// Operations must have a non-empty `operationId`

// Assertation 5:
// Operations must have a non-empty `summary` field.

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  (0, _map2.default)(jsSpec.paths, function (path, pathKey) {
    var pathOps = (0, _pick2.default)(path, ["get", "head", "post", "put", "patch", "delete", "options"]);
    (0, _each2.default)(pathOps, function (op, opKey) {
      if ((0, _includes2.default)(["put", "post"], opKey.toLowerCase())) {

        var hasLocalConsumes = op.consumes && op.consumes.length > 0 && !!op.consumes.join("").trim();
        var hasGlobalConsumes = !!jsSpec.consumes;

        if (!hasLocalConsumes && !hasGlobalConsumes) {
          errors.push({
            path: "paths." + pathKey + "." + opKey + ".consumes",
            message: "PUT and POST operations must have a non-empty `consumes` field."
          });
        }
      }

      var isGetOperation = opKey.toLowerCase() === "get";
      if (isGetOperation) {

        // get operations should not have a consumes property
        if (op.consumes) {
          warnings.push({
            path: "paths." + pathKey + "." + opKey + ".consumes",
            message: "GET operations should not specify a consumes field."
          });
        }

        // get operations should have a produces property
        var hasLocalProduces = op.produces && op.produces.length > 0 && !!op.produces.join("").trim();
        var hasGlobalProduces = !!jsSpec.produces;

        if (!hasLocalProduces && !hasGlobalProduces) {
          errors.push({
            path: "paths." + pathKey + "." + opKey + ".produces",
            message: "GET operations must have a non-empty `produces` field."
          });
        }
      }

      var hasOperationId = op.operationId && op.operationId.length > 0 && !!op.operationId.toString().trim();
      if (!hasOperationId) {
        warnings.push({
          path: "paths." + pathKey + "." + opKey + ".operationId",
          message: "Operations must have a non-empty `operationId`."
        });
      }

      var hasSummary = op.summary && op.summary.length > 0 && !!op.summary.toString().trim();
      if (!hasSummary) {
        warnings.push({
          path: "paths." + pathKey + "." + opKey + ".summary",
          message: "Operations must have a non-empty `summary` field."
        });
      }
    });
  });

  return { errors: errors, warnings: warnings };
}