/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResolvedSpec } = require('@ibm-cloud/openapi-ruleset-utilities');
const {
    LoggerFactory,
    isCreateOperation,
    isOperationOfType,
    getResourceSpecificSiblingPath,
    getResponseCodes,
    pathHasMinimallyRepresentedResource,
} = require('../utils');

let ruleId;
let logger;

module.exports = function (operation, _opts, context) {
    if (!logger) {
        ruleId = context.rule.name;
        logger = LoggerFactory.getInstance().getLogger(ruleId);
    }

    return responseStatusBody(operation, context.path, getResolvedSpec(context));
};

function responseStatusBody(operation, path, apidef) {
    if (!operation.responses) {
        return [];
    }

    logger.debug(
        `${ruleId}: checking response bodies for operation at location: ${path.join(
            '.'
        )}`
    );

    const errors = [];

    const [statusCodes] = getResponseCodes(operation.responses);

    if(statusCodes.length) {

    }

    return errors;
}