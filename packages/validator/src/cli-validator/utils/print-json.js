/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

function printJson(context, results) {
  console.log(JSON.stringify(results, null, 2));
}

module.exports = printJson;
