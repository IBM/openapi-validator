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
  return checkForCircularRef($ref, context.path);
};

// This set is used to make sure that we warn about each distinct $ref value only once.
const reportedRefValues = new Set();

/**
 * This function implements the "circular-refs" rule, which will check for
 * $refs within the API definition that form cycles, either directly or indirectly.
 * In this context, a circular ref (or cycle) would be a $ref to some sort of object (e.g. a schema)
 * where traversing the referenced object's various sub-objects (e.g. schema properties,
 * allOf/anyOf/oneOf lists, "additionalProperties", "items", etc.) leads us to a $ref that is a
 * reference to the original referenced object.
 * An example of a direct cycle would be a schema "Foo" that contains a property "foo" that is
 * an instance of "Foo" itself".
 * An example of an indirect cycle would be a "Foo" schema that contains property
 * "bar" that is an instance of the "Bar" schema, and "Bar" contains a
 * property "foo" that is an instance of the "Foo" schema.
 *
 * The way this rule is implemented is a bit odd so requires some explanation.
 * The legacy "has_circular_refs" rule used both the resolved and unresolved API definition
 * to perform its logic, where it traversed the API definition and identified $refs that form cycles.
 * Unfortunately, spectral-style rules cannot access both the resolved and unresolved
 * API definitions simultaneously, because a rule has to declare whether it should operate on
 * one or the other but can't operate on both.  Due to this constraint, this rule is defined
 * with "resolved=true" even though the "given" field indicates that the rule function should
 * be invoked for each $ref property found in the API definition.
 * The net result is that Spectral invokes the function for each $ref that survived the
 * resolution step, meaning that it could not be resolved.
 * The main (only?) reason a $ref couldn't be resolved would be if the reference constitutes a
 * cycle (a circular ref). Note that an invalid $ref (i.e. a $ref that references a non-existent
 * object) will cause Spectral to immediately report that failure and abort the validator run.
 *
 * So, with all this in mind, the logic of this rule is actually pretty simple.
 * It examines each $ref value to determine whether it is local or external.
 * We'll ignore external $refs, but for a local $ref, we'll simply return a warning and report it as
 * a circular ref.
 *
 * @param {*} $ref the $ref value
 * @param {*} path the array of path segments indicating the "location" of the $ref property within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkForCircularRef($ref, path) {
  // $ref *may* be the name of a property, etc. so this check makes sure we are
  // validating a $ref property that points to a string value, which should
  // nearly always be an actual reference value.
  if (typeof $ref !== 'string') {
    return [];
  }

  logger.debug(
    `${ruleId}: found unresolved $ref '${$ref}' at location: ${path.join('.')}`
  );
  logger.debug(`reportedRefValues: ${[...reportedRefValues]}`);

  // Bail out now if $ref is not a local ref.
  if (!$ref.startsWith('#')) {
    logger.debug(`Found an external reference: ${$ref}`);
    return [];
  }

  // Return a warning only if we have not reported on this $ref value yet.
  if (!reportedRefValues.has($ref)) {
    logger.debug(`Reporting circular $ref: ${$ref}`);
    reportedRefValues.add($ref);
    return [
      {
        message: 'API definition should not contain circular references',
        path,
      },
    ];
  }

  return [];
}
