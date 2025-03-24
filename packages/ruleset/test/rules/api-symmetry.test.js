/**
 * Copyright 2023 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { apiSymmetry } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = apiSymmetry;
const ruleId = 'ibm-api-symmetry';
const expectedMsg =
  'Variant schema should be a graph fragment of the canonical schema';
const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('summary schema is compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieSummary = {
        description: 'This is the Movie Summary schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };
      testDocument.components.schemas.MovieCollection.allOf[1].properties.movies.items =
        {
          $ref: '#/components/schemas/MovieSummary',
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('summary/canonical schema would not be compliant but on non-resource-oriented path', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Thing = {
        description: 'This is the Thing schema.',
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
        },
      };
      testDocument.components.schemas.ThingSummary = {
        description: 'This is the Thing Summary schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };
      // Note: no generic path alongside it
      testDocument.paths['/v1/thing/{id}'] = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Thing',
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('canonical schema is composed, prototype schema is not but is compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      // Drink uses a oneOf but a non-composed schema that contains elements that
      // apply to all schemas constitutes a proper graph fragment
      testDocument.components.schemas.DrinkPrototype = {
        type: 'object',
        properties: {
          type: {
            description: 'The drink type',
            type: 'string',
            enum: ['soda', 'juice'],
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is composed and is compliant, canonical schema is not composed', async () => {
      const testDocument = makeCopy(rootDocument);

      // DrinkPrototype uses a oneOf but Drink contains the superset of properties,
      // so the prototype constitutes a proper graph fragment
      testDocument.components.schemas.Drink = {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['juice', 'soda'],
          },
          name: {
            type: 'string',
          },
          fruit: {
            type: 'string',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('schemas dont define properties directly - prototype is compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.SodaPrototype = makeCopy(
        testDocument.components.schemas.Soda
      );

      testDocument.components.schemas.JuicePrototype = makeCopy(
        testDocument.components.schemas.Juice
      );

      testDocument.components.schemas.DrinkPrototype.oneOf[0].$ref =
        '#/components/schemas/JuicePrototype';
      testDocument.components.schemas.DrinkPrototype.oneOf[1].$ref =
        '#/components/schemas/SodaPrototype';

      // Nest the "id" property within each oneOf element of Drink
      delete testDocument.components.schemas.Drink.properties;
      testDocument.components.schemas.Soda.properties.id = {
        type: 'string',
      };
      testDocument.components.schemas.Juice.properties.id = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema graph fragment with writeOnly properties is compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkPrototype.properties = {
        brand: {
          type: 'string',
          description: 'okay to be here',
          writeOnly: true,
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is compliant with canonical version of nested reference schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Actor = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          gender: { type: 'string' },
          age: { type: 'integer' },
        },
      };
      testDocument.components.schemas.ActorReference = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };
      testDocument.components.schemas.ActorPrototype = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          gender: { type: 'string' },
          age: { type: 'integer' },
        },
      };

      testDocument.components.schemas.Movie.properties.lead_role = {
        $ref: '#/components/schemas/ActorReference',
      };

      testDocument.components.schemas.MoviePrototype.properties.lead_role = {
        $ref: '#/components/schemas/ActorPrototype',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is compliant with canonical version of reference schema nested in composed schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Actor = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          info: {
            type: 'object',
            properties: {
              age: {
                type: 'integer',
              },
            },
          },
        },
      };
      testDocument.components.schemas.ActorReference = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };
      testDocument.components.schemas.ActorPrototype = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          info: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  age: { type: 'integer' },
                },
              },
            ],
          },
        },
      };

      testDocument.components.schemas.Movie.properties.lead = {
        allOf: [
          { description: 'Lead actor in canonical context' },
          { $ref: '#/components/schemas/ActorReference' },
        ],
      };

      testDocument.components.schemas.MoviePrototype.properties.lead = {
        $ref: '#/components/schemas/ActorPrototype',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('patch schema with complex, composed structure is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Speakers = {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              age: {
                type: 'integer',
              },
            },
          },
        },
      };
      testDocument.components.schemas.Engine = {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              age: {
                type: 'integer',
              },
            },
          },
        },
      };

      testDocument.components.schemas.Car.properties.hardware = {
        oneOf: [
          {
            $ref: '#/components/schemas/Speakers',
          },
          {
            $ref: '#/components/schemas/Engine',
          },
        ],
      };

      testDocument.components.schemas.FrontSpeaker = {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              age: {
                type: 'integer',
              },
            },
          },
        },
      };
      testDocument.components.schemas.RearSpeaker = {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              age: {
                type: 'integer',
              },
            },
          },
        },
      };
      testDocument.components.schemas.CarPatch.properties.hardware = {
        type: 'object',
        properties: {
          brand: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              age: {
                type: 'integer',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('complicated and composed patch schema is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.ComfortFeatures = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                type: 'object',
                properties: {
                  front: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                  rear: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      testDocument.components.schemas.FunctionFeatures = {
        type: 'object',
        properties: {
          engine: {
            type: 'string',
          },
        },
      };

      testDocument.components.schemas.Car.properties.features = {
        oneOf: [
          {
            $ref: '#/components/schemas/ComfortFeatures',
          },
          {
            $ref: '#/components/schemas/FunctionFeatures',
          },
        ],
      };

      testDocument.components.schemas.FrontSpeaker = {
        type: 'object',
        properties: {
          front: {
            type: 'object',
            properties: {
              brand: {
                type: 'string',
              },
            },
          },
        },
      };
      testDocument.components.schemas.RearSpeaker = {
        type: 'object',
        properties: {
          rear: {
            type: 'object',
            properties: {
              brand: {
                type: 'string',
              },
            },
          },
        },
      };
      testDocument.components.schemas.CarPatch.properties.features = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                anyOf: [
                  {
                    $ref: '#/components/schemas/FrontSpeaker',
                  },
                  {
                    $ref: '#/components/schemas/RearSpeaker',
                  },
                ],
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('schemas using allOf are compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.DrinkBase = {
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
      };
      testDocument.components.schemas.DrinkPrototype = {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/DrinkBase',
          },
          {
            type: 'object',
            properties: {
              drink_style: {
                type: 'string',
              },
            },
          },
        ],
      };
      testDocument.components.schemas.Drink = {
        type: 'object',
        allOf: [
          {
            $ref: '#/components/schemas/DrinkPrototype',
          },
          {
            type: 'object',
            properties: {
              container_volume: {
                type: 'string',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('complex prototype schema with multiple, nested reference schemas is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Filmmaker = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          age: { type: 'integer' },
          education: {
            allOf: [
              { $ref: '#/components/schemas/SchoolReference' },
              { description: 'overwritten description for education' },
            ],
          },
        },
      };
      testDocument.components.schemas.FilmmakerReference = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      };
      testDocument.components.schemas.School = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          location: { type: 'string' },
        },
      };
      testDocument.components.schemas.SchoolReference = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      };

      testDocument.components.schemas.GeneralIdentity = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };
      testDocument.components.schemas.DirectorPrototype = {
        oneOf: [
          { $ref: '#/components/schemas/GeneralIdentity' },
          { $ref: '#/components/schemas/DirectorContext' },
        ],
      };
      testDocument.components.schemas.DirectorContext = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          education: { $ref: '#/components/schemas/SchoolPrototype' },
        },
      };
      testDocument.components.schemas.SchoolPrototype = {
        oneOf: [
          { $ref: '#/components/schemas/GeneralIdentity' },
          { $ref: '#/components/schemas/SchoolContext' },
        ],
      };
      testDocument.components.schemas.SchoolContext = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          location: { type: 'string' },
        },
      };

      testDocument.components.schemas.Movie.properties.director = {
        $ref: '#/components/schemas/FilmmakerReference',
      };

      testDocument.components.schemas.MoviePrototype.properties.director = {
        allOf: [
          { $ref: '#/components/schemas/DirectorPrototype' },
          { description: 'Director type for creating a movie' },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema with nested additionalProperties is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            description: 'key-value pairs mapping name to role',
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
        },
      };

      testDocument.components.schemas.MoviePrototype.properties.personnel =
        testDocument.components.schemas.Movie.properties.personnel;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema with nested patternProperties is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            description: 'key-value pairs mapping name to role',
            type: 'object',
            patternProperties: {
              '^[A-Z][a-z]+( ?[A-Z][a-z]+)*$': {
                type: 'string',
              },
            },
          },
        },
      };

      testDocument.components.schemas.MoviePrototype.properties.personnel =
        testDocument.components.schemas.Movie.properties.personnel;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema for composed canonical with nested dictionary is compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            allOf: [
              {
                additionalProperties: {
                  type: 'object',
                  properties: {
                    some_field: {
                      type: 'string',
                    },
                  },
                },
              },
            ],
          },
        },
      };

      testDocument.components.schemas.MoviePrototype.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                some_field: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema with nested dictionary containing graph fragment model variant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                some_field: {
                  type: 'string',
                },
                some_other_field: {
                  type: 'integer',
                },
              },
            },
          },
        },
      };

      testDocument.components.schemas.MoviePrototype.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                some_field: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is identical to canonical schema (no omitted properties)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkPrototype =
        testDocument.components.schemas.Drink;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is identical to canonical - properties nested in oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Soda.properties.id = {
        type: 'string',
      };

      testDocument.components.schemas.Juice.properties.id = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('prototype schema is identical to canonical but defines writeOnly properties', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.DrinkPrototype = makeCopy(
        testDocument.components.schemas.Drink
      );

      testDocument.components.schemas.DrinkPrototype.properties.random = {
        type: 'string',
        description: 'the only differentiator',
        writeOnly: true,
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('patch schema is identical to canonical schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CarPatch.properties.id = {
        type: 'string',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('canonical schema contains nested reference to reference schema', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Actor = {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/ActorReference' },
          {
            properties: {
              name: { type: 'string' },
              gender: { type: 'string' },
              age: { type: 'integer' },
            },
          },
        ],
      };
      testDocument.components.schemas.ActorReference = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };
      testDocument.components.schemas.ActorPrototype = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          gender: { type: 'string' },
          age: { type: 'integer' },
        },
      };

      testDocument.components.schemas.Movie.properties.lead_role = {
        $ref: '#/components/schemas/Actor',
      };

      testDocument.components.schemas.MoviePrototype.properties.lead_role = {
        $ref: '#/components/schemas/ActorPrototype',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    // Already covered in root document:
    // - Valid Prototype schemas
    // - Valid Patch schemas
  });

  describe('Should yield errors', () => {
    it('summary schema has property not defined on canonical', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieSummary = {
        description: 'This is the Movie Summary schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
          random: {
            type: 'integer',
            description: 'This should not be here!',
          },
        },
      };
      testDocument.components.schemas.MovieCollection.allOf[1].properties.movies.items =
        {
          $ref: '#/components/schemas/MovieSummary',
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MovieSummary'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('summary schema with allOf defines property not on canonical', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MovieMetadata = {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
        },
      };
      testDocument.components.schemas.MovieRandom = {
        type: 'object',
        properties: {
          random: {
            type: 'integer',
            description: 'This should not be here!',
          },
        },
      };

      testDocument.components.schemas.MovieSummary = {
        allOf: [
          { $ref: '#/components/schemas/MovieMetadata' },
          { $ref: '#/components/schemas/MovieRandom' },
        ],
      };
      testDocument.components.schemas.MovieCollection.allOf[1].properties.movies.items =
        {
          $ref: '#/components/schemas/MovieSummary',
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MovieSummary'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('summary schema is not compliant - schema nested in array', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.cast = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      };

      testDocument.components.schemas.MovieSummary = {
        description: 'This is the Movie Summary schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
          cast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                age: {
                  type: 'integer',
                  description: 'should not be here',
                },
              },
            },
          },
        },
      };
      testDocument.components.schemas.MovieCollection.allOf[1].properties.movies.items =
        {
          $ref: '#/components/schemas/MovieSummary',
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MovieSummary'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('summary schema is not compliant - arrays with different types', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.properties.cast = {
        type: 'array',
        items: {
          type: 'string',
        },
      };

      testDocument.components.schemas.MovieSummary = {
        description: 'This is the Movie Summary schema.',
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            $ref: '#/components/schemas/IdString',
          },
          name: {
            $ref: '#/components/schemas/NormalString',
          },
          cast: {
            type: 'array',
            items: {
              type: 'integer',
            },
          },
        },
      };
      testDocument.components.schemas.MovieCollection.allOf[1].properties.movies.items =
        {
          $ref: '#/components/schemas/MovieSummary',
        };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MovieSummary'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema with oneOf is not compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.SodaPrototype = makeCopy(
        testDocument.components.schemas.Soda
      );

      testDocument.components.schemas.SodaPrototype.properties.brand = {
        type: 'string',
        description: 'should not be here',
      };

      testDocument.components.schemas.DrinkPrototype.oneOf[1].$ref =
        '#/components/schemas/SodaPrototype';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.DrinkPrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema defines property that exists in canonical but uses wrong type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.CarPrototype.properties.make = {
        type: 'integer',
        description: 'this should be a string, like in the canonical schema',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.CarPrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema defines writeOnly properties but is not compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.JuicePrototype = makeCopy(
        testDocument.components.schemas.Juice
      );
      testDocument.components.schemas.SodaPrototype = makeCopy(
        testDocument.components.schemas.Soda
      );

      testDocument.components.schemas.JuicePrototype.properties.brix = {
        type: 'integer',
        description: 'okay to be here',
        writeOnly: true,
      };
      testDocument.components.schemas.SodaPrototype.properties.brand = {
        type: 'string',
        description: 'should not be here',
      };

      testDocument.components.schemas.DrinkPrototype.oneOf[0].$ref =
        '#/components/schemas/JuicePrototype';
      testDocument.components.schemas.DrinkPrototype.oneOf[1].$ref =
        '#/components/schemas/SodaPrototype';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.DrinkPrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('complicated and composed patch schema is not compliant', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.ComfortFeatures = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                type: 'object',
                properties: {
                  front: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                  rear: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      testDocument.components.schemas.FunctionFeatures = {
        type: 'object',
        properties: {
          engine: {
            type: 'string',
          },
        },
      };

      testDocument.components.schemas.Car.properties.features = {
        oneOf: [
          {
            $ref: '#/components/schemas/ComfortFeatures',
          },
          {
            $ref: '#/components/schemas/FunctionFeatures',
          },
        ],
      };

      testDocument.components.schemas.FrontSpeaker = {
        type: 'object',
        properties: {
          front: {
            type: 'object',
            properties: {
              brand: {
                type: 'string',
              },
            },
          },
        },
      };
      testDocument.components.schemas.RearSpeaker = {
        type: 'object',
        properties: {
          rear: {
            type: 'object',
            properties: {
              brand: {
                type: 'integer',
                description: 'should be string',
              },
            },
          },
        },
      };
      testDocument.components.schemas.CarPatch.properties.features = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                anyOf: [
                  {
                    $ref: '#/components/schemas/FrontSpeaker',
                  },
                  {
                    $ref: '#/components/schemas/RearSpeaker',
                  },
                ],
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.CarPatch'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('patch schema defines a nested property that does not exist on canonical', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Car.properties.features = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                type: 'object',
                properties: {
                  front: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                  rear: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      testDocument.components.schemas.CarPatch.properties.features = {
        type: 'object',
        properties: {
          audio_package: {
            type: 'object',
            properties: {
              speakers: {
                type: 'object',
                properties: {
                  front: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                      power: {
                        type: 'integer',
                        description: 'cant patch a property that doesnt exist',
                      },
                    },
                  },
                  rear: {
                    type: 'object',
                    properties: {
                      brand: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.CarPatch'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('canonical schema has additional properties, prototype is still not compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.Movie.additionalProperties = true;
      testDocument.components.schemas.MoviePrototype.properties.lead_role = {
        type: 'string',
        description: 'not explicitly defined in canonical',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MoviePrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema has additional properties - not compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MoviePrototype.additionalProperties = true;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MoviePrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema is a completely different type', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas.MoviePrototype = {
        type: 'array',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MoviePrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema has nested dictionary not included in canonical', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            properties: {
              names: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      testDocument.components.schemas.MoviePrototype.properties.personnel = {
        type: 'object',
        properties: {
          cast: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MoviePrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('canonical schema has pattern properties align with type of prototype properties - still not compliant', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.Movie.patternProperties = {
        '^is.*$': {
          type: 'boolean',
        },
      };
      testDocument.components.schemas.MoviePrototype.properties.isFunToWatch = {
        type: 'boolean',
        description: 'not explicitly defined in canonical',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.MoviePrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });

    it('prototype schema has pattern properties - not compliant (3.1)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.openapi = '3.1.0';
      testDocument.components.schemas.SodaPrototype = makeCopy(
        testDocument.components.schemas.Soda
      );

      testDocument.components.schemas.SodaPrototype.patternProperties = {
        '^is.*$': {
          type: 'boolean',
        },
      };

      testDocument.components.schemas.DrinkPrototype.oneOf[1].$ref =
        '#/components/schemas/SodaPrototype';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      const expectedPaths = ['components.schemas.DrinkPrototype'];
      for (const i in results) {
        expect(results[i].code).toBe(ruleId);
        expect(results[i].message).toBe(expectedMsg);
        expect(results[i].severity).toBe(expectedSeverity);
        expect(results[i].path.join('.')).toBe(expectedPaths[i]);
      }
    });
  });
});
