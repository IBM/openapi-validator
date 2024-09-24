/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { basename } = require('node:path');

// Get the title for an API.
function getTitle(apiDef, filename) {
  let title = '';
  if (apiDef.info) {
    title = apiDef.info.title || apiDef.info['x-alternate-name'];

    // If title is from API definition, it doesn't help us prevent collisions
    // with other APIs of the same name (different versions of same API, etc.)
    if (title && apiDef.info.version) {
      title += ` ${apiDef.info.version}`;
    }
  }

  // Fallback to the name of the file.
  if (!title) {
    // The file may be a full path - if so, extract the name of the file itself.
    title = basename(filename);
  }

  return title;
}

module.exports = {
  getTitle,
};
