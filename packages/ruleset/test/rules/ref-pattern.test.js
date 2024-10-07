/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { refPattern } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = refPattern;
const ruleId = 'ibm-ref-pattern';
const expectedSeverity = severityCodes.warning;

const expectedMsgs = {
  callbacks: "$refs to callbacks should start with '#/components/callbacks/'",
  examples: "$refs to examples should start with '#/components/examples/'",
  headers: "$refs to headers should start with '#/components/headers/'",
  links: "$refs to links should start with '#/components/links/'",
  parameters:
    "$refs to parameters should start with '#/components/parameters/'",
  requestBodies:
    "$refs to requestBodies should start with '#/components/requestBodies/'",
  responses: "$refs to responses should start with '#/components/responses/'",
  schemas: "$refs to schemas should start with '#/components/schemas/'",
  securitySchemes:
    "$refs to securitySchemes should start with '#/components/securitySchemes/'",
};

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Property named $ref should not cause problems', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Car.properties.$ref = {
        type: 'string',
        description: 'this property is actually called $ref',
      };

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('Invalid parameter ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Move the CarIdParam from components.parameters to
      // components.params.
      testDocument.components.params = {
        CarIdParam: testDocument.components.parameters.CarIdParam,
      };
      delete testDocument.components.parameters.CarIdParam;

      // Create a reference to this mis-located parameter.
      testDocument.paths['/v1/cars/{car_id}'].parameters[0].$ref =
        '#/components/params/CarIdParam';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['parameters']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.parameters.0.$ref'
      );
    });

    it('Invalid schema ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Create a simple schema under "components.definitions".
      testDocument.components.definitions = {
        StringType: testDocument.components.schemas.IdString,
      };

      // Create a reference to this mis-located schema.
      testDocument.components.schemas.Car.properties.id.$ref =
        '#/components/definitions/StringType';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['schemas']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.schemas.Car.properties.id.$ref'
      );
    });

    it('Invalid response ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Move a named response from "components.responses" to "components.answers".
      testDocument.components.answers = {
        CarResponse: testDocument.components.responses.CarResponse,
      };

      // Create a reference to this mis-located response.
      testDocument.paths['/v1/cars/{car_id}'].get.responses['200'].$ref =
        '#/components/answers/CarResponse';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['responses']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars/{car_id}.get.responses.200.$ref'
      );
    });

    it('Invalid requestBody ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Move a named requestBody from "components.requestBodies" to "components.requests".
      testDocument.components.requests = {
        CarRequest: testDocument.components.requestBodies.CarRequest,
      };

      // Create a reference to this mis-located response.
      testDocument.paths['/v1/cars'].post.requestBody.$ref =
        '#/components/requests/CarRequest';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['requestBodies']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.requestBody.$ref'
      );
    });

    it('Invalid examples ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Move a named example from "components.examples" to "samples".
      testDocument.samples = {
        CarSample: testDocument.components.examples.CarExample,
      };

      // Create a reference to this mis-located example.
      testDocument.paths['/v1/cars'].post.responses['201'].content[
        'application/json'
      ].examples.ResponseExample.$ref = '#/samples/CarSample';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['examples']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.responses.201.content.application/json.examples.ResponseExample.$ref'
      );
    });

    it('Invalid link ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Move a named link from "components.links" to "relationships".
      testDocument.relationships = {
        CarIdLinkage: testDocument.components.links.CarIdLink,
      };

      // Create a reference to this mis-located link.
      testDocument.paths['/v1/cars'].post.responses['201'].links.CarId.$ref =
        '#/relationships/CarIdLinkage';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['links']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/cars.post.responses.201.links.CarId.$ref'
      );
    });

    it('Invalid securityScheme ref', async () => {
      const testDocument = makeCopy(rootDocument);

      // Create a security scheme under "components.protection".
      testDocument.components.protection = {
        VinnysCrew: {
          in: 'header',
          name: 'Protected',
          type: 'http',
          scheme: 'MobRule',
        },
      };

      // Create a reference to this mis-located security scheme.
      testDocument.components.securitySchemes.VinnysCrew = {
        $ref: '#/components/protection/VinnysCrew',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgs['securitySchemes']);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.securitySchemes.VinnysCrew.$ref'
      );
    });
  });
});
