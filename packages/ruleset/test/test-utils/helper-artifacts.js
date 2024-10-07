/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Copied from `root-document.js`
const pageLink = {
  description: 'Contains a link to a page of paginated results',
  type: 'object',
  properties: {
    href: {
      description: 'The link value',
      type: 'string',
      pattern: '[a-zA-Z0-9 ]+',
      minLength: 1,
      maxLength: 30,
    },
  },
};

// These "Offset*" objects exist to provide artifacts that act as a correct
// baseline for offset/limit style pagination. They are not in the root
// document because we encourage the use of token-based pagination.
module.exports.offsetParameter = {
  name: 'offset',
  in: 'query',
  description: 'The offset (origin 0) of the first item to return.',
  required: false,
  schema: {
    type: 'integer',
    format: 'int32',
    minimum: 0,
  },
};

module.exports.offsetPaginationBase = {
  description:
    'A base schema containing properties that support offset-limit pagination.',
  type: 'object',
  required: ['offset', 'limit', 'total_count'],
  properties: {
    offset: {
      description:
        'The offset (origin 0) of the first item returned in the result page.',
      type: 'integer',
      format: 'int32',
    },
    limit: {
      description: 'The number of items returned in the result page.',
      type: 'integer',
      format: 'int32',
    },
    total_count: {
      description: 'The total number of items across all result pages.',
      type: 'integer',
      format: 'int32',
    },
    first: pageLink,
    next: pageLink,
    previous: pageLink,
    last: pageLink,
  },
};
