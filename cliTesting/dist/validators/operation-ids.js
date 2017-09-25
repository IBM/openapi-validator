"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _pickBy = require("lodash/pickBy");

var _pickBy2 = _interopRequireDefault(_pickBy);

var _reduce = require("lodash/reduce");

var _reduce2 = _interopRequireDefault(_reduce);

var _merge = require("lodash/merge");

var _merge2 = _interopRequireDefault(_merge);

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Assertation 1: Operations must have a unique operationId.

function validate(_ref) {
  var jsSpec = _ref.jsSpec;

  var errors = [];
  var warnings = [];

  var validOperationKeys = ["get", "head", "post", "put", "patch", "delete", "options"];

  var operations = (0, _reduce2.default)(jsSpec.paths, function (arr, path, pathKey) {
    var pathOps = (0, _pickBy2.default)(path, function (obj, k) {
      return validOperationKeys.indexOf(k) > -1;
    });
    (0, _each2.default)(pathOps, function (op, opKey) {
      return arr.push((0, _merge2.default)({
        path: "paths." + pathKey + "." + opKey
      }, op));
    });
    return arr;
  }, []);

  var seenOperationIds = {};

  var tallyOperationId = function tallyOperationId(operationId) {
    var prev = seenOperationIds[operationId];
    seenOperationIds[operationId] = true;
    // returns if it was previously seen
    return !!prev;
  };

  operations.forEach(function (op) {
    // wrap in an if, since operationIds are not required
    if (op.operationId) {
      var hasBeenSeen = tallyOperationId(op.operationId);
      if (hasBeenSeen) {
        errors.push({
          path: op.path + ".operationId",
          message: "operationIds must be unique"
        });
      }
    }
  });

  return { errors: errors, warnings: warnings };
}