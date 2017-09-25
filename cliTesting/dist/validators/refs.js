"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _uniq = require("lodash/uniq");

var _uniq2 = _interopRequireDefault(_uniq);

var _filter = require("lodash/filter");

var _filter2 = _interopRequireDefault(_filter);

var _startsWith = require("lodash/startsWith");

var _startsWith2 = _interopRequireDefault(_startsWith);

var _each = require("lodash/each");

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Assertation 1:
// Referenceable definitions should be used by being referenced in the appropriate way

function validate(_ref) {
  var jsSpec = _ref.jsSpec,
      specStr = _ref.specStr;

  var errors = [];
  var warnings = [];

  // Assertation 1
  // This is a "creative" way to approach the problem of collecting used $refs,
  // but other solutions required walking the jsSpec recursively to detect $refs,
  // which can be quite slow.
  var refRegex = /\$ref.*["'](.*)["']/g;
  var match = refRegex.exec(specStr);
  var refs = [];
  while (match !== null) {
    refs.push(match[1]);
    match = refRegex.exec(specStr);
  }

  // de-dupe the array, and filter out non-definition refs
  var definitionsRefs = (0, _filter2.default)((0, _uniq2.default)(refs), function (v) {
    return (0, _startsWith2.default)(v, "#/definitions");
  });

  (0, _each2.default)(jsSpec.definitions, function (def, defName) {
    if (definitionsRefs.indexOf("#/definitions/" + defName) === -1) {
      warnings.push({
        path: "definitions." + defName,
        message: "Definition was declared but never used in document"
      });
    }
  });

  return { errors: errors, warnings: warnings };
}