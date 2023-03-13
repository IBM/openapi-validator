/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

function printJson(context, results) {
  context.logger.info(JSON.stringify(results, null, 2));
}

module.exports.printJson = printJson;
