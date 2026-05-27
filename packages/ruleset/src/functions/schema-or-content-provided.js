/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

export default function (obj) {
  if (!obj.schema && !obj.content) {
    return [
      {
        message: 'Parameters must provide either a schema or content',
      },
    ];
  }
}
