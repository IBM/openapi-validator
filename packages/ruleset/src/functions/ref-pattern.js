/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function ($ref, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return checkRefPattern($ref, context.path);
};

// This object is used to categorize a $ref value, based on its path (location within the API document).
// Each entry corresponds to a particular type of object to which we support references,
// and coincidentally they also correspond to the various sections within the "components" field of the API definition.
// If a $ref property's path matches against an entry's refPathRegex value, then that entry is used to
// validate the $ref value (i.e. the $ref value must start with that entry's prefix value).
// The entries of this object are ordered in descending order of presumed prevalence.
const validRefPrefixes = {
  schemas: {
    refPathRegex:
      /,((schema)|(properties,[^,]+)|(items)|(additionalProperties)|((allOf|anyOf|oneOf),\d+))$/,
    prefix: '#/components/schemas/',
  },
  parameters: {
    refPathRegex: /,parameters,\d+$/,
    prefix: '#/components/parameters/',
  },
  responses: {
    refPathRegex: /,responses,[^,]+$/,
    prefix: '#/components/responses/',
  },
  requestBodies: {
    refPathRegex: /,requestBody$/,
    prefix: '#/components/requestBodies/',
  },
  links: {
    refPathRegex: /,links,[^,]+$/,
    prefix: '#/components/links/',
  },
  examples: {
    refPathRegex: /,examples,[^,]+$/,
    prefix: '#/components/examples/',
  },
  headers: {
    refPathRegex: /,headers,[^,]+$/,
    prefix: '#/components/headers/',
  },
  securitySchemes: {
    refPathRegex: /,securitySchemes,[^,]+$/,
    prefix: '#/components/securitySchemes/',
  },
  callbacks: {
    refPathRegex: /,callbacks,[^,]+$/,
    prefix: '#/components/callbacks/',
  },
};

function checkRefPattern($ref, path) {
  // $ref *may* be the name of a property, etc. so this check makes sure we are
  // validating a $ref property that points to a string value, which should
  // nearly always be an actual reference value.
  if (typeof $ref !== 'string') {
    return [];
  }

  // We're interested only in local refs (e.g. #/components/schemas/MyModel).
  if (!$ref.startsWith('#')) {
    logger.debug(`${ruleId}: skipping check for external $ref: ${$ref}`);
    return [];
  }

  logger.debug(
    `${ruleId}: checking $ref '${$ref}' at location: ${path.join('.')}`
  );

  // Compute the path of the $ref property's parent object
  // by just removing the last element of "path" (which will be '$ref').
  const parentPath = path.slice(0, path.length - 1);

  const pathStr = parentPath.join(',');

  // Walk through the entries of "validRefPrefixes" until we find the entry
  // that applies to the location where the $ref property was found.
  for (const [refType, entry] of Object.entries(validRefPrefixes)) {
    if (pathStr.match(entry.refPathRegex)) {
      if (!$ref.startsWith(entry.prefix)) {
        logger.debug(
          `${ruleId}: $ref '${$ref}' (type '${refType}') should start with '${entry.prefix}'`
        );
        return [
          {
            message: `$refs to ${refType} should start with '${entry.prefix}'`,
            path,
          },
        ];
      }

      // We want to do the check using only the first (and presumably only) "validRefPrefixes"
      // entry that matches the current $ref property value being checked.
      // So if the above check succeeds, then just bail out now.
      return [];
    }
  }

  return [];
}
