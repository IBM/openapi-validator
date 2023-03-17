/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = function (obj) {
  if (!obj.schema && !obj.content) {
    return [
      {
        message: 'Parameter must provide either a schema or content',
      },
    ];
  }
};
