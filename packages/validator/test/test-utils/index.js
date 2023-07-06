/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  getCapturedText: require('./get-captured-text').getCapturedText,
  getCapturedTextWithColor: require('./get-captured-text')
    .getCapturedTextWithColor,
  getMessageAndPathFromCapturedText:
    require('./get-message-and-path-from-captured-text')
      .getMessageAndPathFromCapturedText,
  stripAnsi: require('./strip-ansi').stripAnsi,
  testValidator: require('./test-validator'),
};
