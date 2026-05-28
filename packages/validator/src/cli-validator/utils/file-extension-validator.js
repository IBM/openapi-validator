/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import last from 'lodash/last.js';

const getExtension = filename => {
  return last(filename.split('.')).toLowerCase();
};

const validateExtension = (filename, supportedFileTypes) => {
  const fileExtension = getExtension(filename);
  const hasExtension = filename.includes('.');
  const goodExtension =
    hasExtension && supportedFileTypes.includes(fileExtension);

  return goodExtension;
};

export const supportedFileExtension = validateExtension;
export const getFileExtension = getExtension;
