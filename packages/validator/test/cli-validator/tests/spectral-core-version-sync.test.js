/**
 * Copyright 2026 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const semver = require('semver');

const validatorPkg = require('../../../package.json');
const rulesetPkg = require('../../../../ruleset/package.json');
const spectralRulesetsPkg = require('@stoplight/spectral-rulesets/package.json');

// The version of @stoplight/spectral-core declared in each package.json.
// These must stay in sync to avoid an instanceof Ruleset mismatch.
const validatorPin = validatorPkg.dependencies['@stoplight/spectral-core'];
const rulesetDevPin = rulesetPkg.devDependencies['@stoplight/spectral-core'];
const spectralRulesetsRange =
  spectralRulesetsPkg.dependencies['@stoplight/spectral-core'];

describe('spectral-core version sync', function () {
  it('validator and ruleset devDependency should pin the same spectral-core version', function () {
    expect(validatorPin).toEqual(rulesetDevPin);
  });

  it('validator spectral-core pin should satisfy the range required by spectral-rulesets', function () {
    const satisfies = semver.satisfies(validatorPin, spectralRulesetsRange);
    expect(satisfies).toBe(true);
  });
});
