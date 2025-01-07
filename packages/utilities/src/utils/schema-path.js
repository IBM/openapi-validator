/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Necessary to get exceptions thrown for attempts to modify frozen objects
'use strict';

/**
 * @private
 */
class SchemaPath extends Array {
  constructor(physical, logical = []) {
    super(...physical);
    this.logical = Object.freeze([...logical]);
    Object.freeze(this);
  }

  withProperty(name) {
    return new SchemaPath(
      [...this, 'properties', name],
      [...this.logical, name]
    );
  }

  withAdditionalProperty() {
    return new SchemaPath(
      [...this, 'additionalProperties'],
      [...this.logical, '*']
    );
  }

  withPatternProperty(pattern) {
    return new SchemaPath(
      [...this, 'patternProperties', pattern],
      [...this.logical, '*']
    );
  }

  withArrayItem() {
    return new SchemaPath([...this, 'items'], [...this.logical, '[]']);
  }

  withApplicator(applicator, index) {
    return new SchemaPath([...this, applicator, String(index)], this.logical);
  }

  withNot() {
    return new SchemaPath([...this, 'not'], this.logical);
  }
}

module.exports = SchemaPath;
