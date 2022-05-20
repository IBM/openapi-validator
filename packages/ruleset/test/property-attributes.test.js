const { propertyAttributes } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = propertyAttributes;
const ruleId = 'property-attributes';
const expectedSeverity = severityCodes.error;

describe('Spectral rule: property-attributes', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    describe('Numeric schema tests', () => {
      it('minimum defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 3
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('maximum defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          maximum: 3
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('minimum <= maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 3,
          maximum: 4
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
    });

    describe('Array schema tests', () => {
      it('minItems defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'array',
          minItems: 3,
          items: {
            type: 'integer'
          }
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('maxItems defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'array',
          maxItems: 3,
          items: {
            type: 'integer'
          }
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('minItems <= maxItems', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'integer'
          }
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
    });

    describe('Object schema tests', () => {
      it('minProperties defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 3
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('maxProperties defined by itself', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          maxProperties: 3
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
      it('minProperties <= maxProperties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 3,
          maxProperties: 10
        };

        const results = await testRule(ruleId, rule, rootDocument);
        expect(results).toHaveLength(0);
      });
    });
  });

  describe('Should yield errors', () => {
    describe('Numeric schema tests', () => {
      it('minimum > maximum', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minimum: 4,
          maximum: 3
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minimum'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minimum cannot be greater than maximum'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('minimum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'string',
          minimum: 4
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minimum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minimum'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minimum should not be defined for a non-numeric schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('maximum defined for non-numeric schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          maximum: 4
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.maximum',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maximum',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maximum'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'maximum should not be defined for a non-numeric schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Array schema tests', () => {
      it('minItems > maxItems', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'array',

          items: {
            type: 'integer'
          },
          minItems: 5,
          maxItems: 4
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minItems',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minItems',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minItems'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minItems cannot be greater than maxItems'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('minItems defined for non-array schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minItems: 3
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minItems',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minItems',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minItems'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minItems should not be defined for a non-array schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('maxItems defined for non-array schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          maxItems: 3
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.maxItems',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maxItems',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maxItems'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'maxItems should not be defined for a non-array schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Object schema tests', () => {
      it('minProperties > maxProperties', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'object',
          minProperties: 5,
          maxProperties: 4
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minProperties'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minProperties cannot be greater than maxProperties'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('minProperties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'integer',
          minProperties: 3
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.minProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.minProperties'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'minProperties should not be defined for a non-object schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
      it('maxProperties defined for non-object schema', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.schemas.Car.properties['wheel_count'] = {
          type: 'number',
          format: 'double',
          maxProperties: 3
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(3);
        const expectedPaths = [
          'paths./v1/cars.post.requestBody.content.application/json.schema.properties.wheel_count.maxProperties',
          'paths./v1/cars.post.responses.201.content.application/json.schema.properties.wheel_count.maxProperties',
          'paths./v1/cars/{car_id}.get.responses.200.content.application/json.schema.properties.wheel_count.maxProperties'
        ];
        for (let i = 0; i < results.length; i++) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(
            'maxProperties should not be defined for a non-object schema'
          );
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });
  });
});
