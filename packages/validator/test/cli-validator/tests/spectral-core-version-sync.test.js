/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

'use strict';

const semver = require('semver');

const validatorPkg = require('../../../package.json');
const rulesetPkg = require('../../../../ruleset/package.json');
const spectralRulesetsPkg = require('../../../../../node_modules/@stoplight/spectral-rulesets/package.json');

// The version of @stoplight/spectral-core declared in each package.json.
// These must stay in sync to avoid an instanceof Ruleset mismatch.
const validatorPin = validatorPkg.dependencies['@stoplight/spectral-core'];
const rulesetDevPin = rulesetPkg.devDependencies['@stoplight/spectral-core'];
const rulesetPeerRange =
  rulesetPkg.peerDependencies['@stoplight/spectral-core'];
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

  it('ruleset peerDependency range should be satisfied by the validator spectral-core pin', function () {
    const satisfies = semver.satisfies(validatorPin, rulesetPeerRange);
    expect(satisfies).toBe(true);
  });
});
