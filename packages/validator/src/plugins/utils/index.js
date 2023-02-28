/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Expose validator utils as a module with each sub-module as a property

module.exports.checkCase = require('./case-convention-check');
module.exports.walk = require('./walk');
module.exports.isParameterObject = require('./is-parameter');
module.exports.isResponseObject = require('./is-response');
module.exports.hasRefProperty = require('./has-ref-property');
