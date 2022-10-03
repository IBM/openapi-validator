const { composedSchemaRestrictions } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = composedSchemaRestrictions;
const ruleId = 'composed-schema-restrictions';
const expectedSeverity = severityCodes.error;
const expectedMsgObjSchema =
  'A schema within a oneOf/anyOf list must be an object schema';
const expectedMsgProp =
  'Duplicate property with incompatible type defined in schema within a oneOf/anyOf list:';

describe('Spectral rule: schema-description', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('Primitive property w/oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].properties = {
        type: {
          type: 'string',
          oneOf: [
            {
              enum: ['soda']
            },
            {
              enum: ['juice']
            }
          ]
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Primitive `items` schema w/anyOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].properties = {
        drink_types: {
          type: 'array',
          items: {
            type: 'string',
            anyOf: [
              {
                minLength: 1,
                maxLength: 10
              },
              {
                enum: ['juice']
              }
            ]
          }
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Primitive `additionalProperties` schema w/oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].additionalProperties = {
        type: 'string',
        oneOf: [
          {
            minLength: 1,
            maxLength: 10
          },
          {
            enum: ['foo', 'bar']
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Compatible properties defined in allOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].allOf = [
        {
          properties: {
            float_prop: {
              type: 'number',
              format: 'float'
            }
          }
        },
        {
          properties: {
            double_prop: {
              type: 'number',
              format: 'double'
            }
          }
        }
      ];

      testDocument.components.schemas['Soda'].allOf = [
        {
          properties: {
            float_prop: {
              type: 'number',
              format: 'float'
            }
          }
        }
      ];

      testDocument.components.schemas['Juice'].allOf = [
        {
          properties: {
            double_prop: {
              type: 'number',
              format: 'double'
            }
          }
        }
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Compatible properties that are objects (refs)', async () => {
      const testDocument = makeCopy(rootDocument);

      const objectSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'integer'
          }
        }
      };

      const schemaRef = {
        $ref: '#/components/schemas/ObjectSchema'
      };

      testDocument.components.schemas['ObjectSchema'] = objectSchema;

      testDocument.components.schemas['Drink'].properties = {
        object_prop: schemaRef
      };

      testDocument.components.schemas[
        'Soda'
      ].properties.object_prop = schemaRef;

      testDocument.components.schemas[
        'Juice'
      ].properties.object_prop = schemaRef;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Compatible properties that are objects (refs, allOf)', async () => {
      const testDocument = makeCopy(rootDocument);

      const objectSchema = {
        allOf: [
          {
            properties: {
              foo: {
                type: 'string'
              }
            }
          },
          {
            properties: {
              bar: {
                type: 'integer'
              }
            }
          }
        ]
      };

      testDocument.components.schemas['ObjectSchema'] = objectSchema;

      const schemaRef = {
        $ref: '#/components/schemas/ObjectSchema'
      };

      testDocument.components.schemas['Drink'].properties = {
        object_prop: schemaRef
      };

      testDocument.components.schemas[
        'Soda'
      ].properties.object_prop = schemaRef;

      testDocument.components.schemas[
        'Juice'
      ].properties.object_prop = schemaRef;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Empty oneOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].additionalProperties = {
        type: 'object',
        properties: {
          oneOf: {
            type: 'string'
          }
        },
        oneOf: []
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Empty anyOf', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.components.schemas['Drink'].additionalProperties = {
        type: 'object',
        properties: {
          anyOf: {
            type: 'string'
          }
        },
        anyOf: []
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('AnyOf with non-object schemas', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);

      const notAnObject = {
        description: 'non-object schema within anyOf',
        anyOf: [
          {
            type: 'string',
            format: 'date-time'
          },
          {
            properties: {
              foo: {
                type: 'string'
              }
            }
          }
        ]
      };

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NotAnObject'] = notAnObject;

      newDrinkSchema.additionalProperties = {
        $ref: '#/components/schemas/NotAnObject'
      };

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgObjSchema);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.additionalProperties.anyOf.0'
      );
    });

    it('Incompatible properties defined in main & subschema', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';

      newDrinkSchema.properties = {
        drink_size: {
          type: 'integer',
          format: 'int64'
        }
      };
      newJuiceSchema.properties.drink_size = {
        type: 'integer',
        format: 'int32'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} drink_size`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0'
      );
    });

    it('Incompatible properties defined in two subschemas', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);
      const newSodaSchema = makeCopy(testDocument.components.schemas['Soda']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;
      testDocument.components.schemas['NewSoda'] = newSodaSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';
      newDrinkSchema.oneOf[1].$ref = '#/components/schemas/NewSoda';

      newSodaSchema.properties.bad_prop = {
        type: 'string'
      };
      newJuiceSchema.properties.bad_prop = {
        type: 'integer'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} bad_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1'
      );
    });

    it('Incompatible properties defined in subschema allOfs', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newSodaSchema = makeCopy(testDocument.components.schemas['Soda']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;
      testDocument.components.schemas['NewSoda'] = newSodaSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';
      newDrinkSchema.oneOf[1].$ref = '#/components/schemas/NewSoda';

      newSodaSchema.allOf = [
        {
          properties: {
            bad_prop: {
              type: 'string'
            }
          }
        }
      ];
      newJuiceSchema.allOf = [
        {
          properties: {
            bad_prop: {
              type: 'integer'
            }
          }
        }
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} bad_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1'
      );
    });

    it('Incompatible properties defined in complex compositions', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newSodaSchema = makeCopy(testDocument.components.schemas['Soda']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;
      testDocument.components.schemas['NewSoda'] = newSodaSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';
      newDrinkSchema.oneOf[1].$ref = '#/components/schemas/NewSoda';

      newSodaSchema.allOf = [
        {
          allOf: [
            {
              allOf: [
                {
                  properties: {
                    bad_prop: {
                      type: 'string'
                    }
                  }
                }
              ]
            }
          ]
        }
      ];
      newJuiceSchema.allOf = [
        {
          allOf: [
            {
              allOf: [
                {
                  allOf: [
                    {
                      properties: {
                        bad_prop: {
                          type: 'integer'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} bad_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.1'
      );
    });

    it('Incompatible properties that are objects (non-refs)', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';

      const objectSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'integer'
          }
        }
      };

      testDocument.components.schemas['NewDrink'].properties = {
        object_prop: objectSchema
      };

      newJuiceSchema.properties.object_prop = {
        allOf: [
          {
            objectSchema
          },
          {
            description: 'This makes the schema different.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} object_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0'
      );
    });

    it('Incompatible properties that are objects (refs)', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';

      const objectSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'integer'
          }
        }
      };

      // Two identical schemas with different names -> incompatible due
      // to different datatypes in generated code.
      testDocument.components.schemas['Object1'] = objectSchema;
      testDocument.components.schemas['Object2'] = objectSchema;

      testDocument.components.schemas['NewDrink'].properties = {
        object_prop: {
          $ref: '#/components/schemas/Object1'
        }
      };

      newJuiceSchema.properties.object_prop = {
        $ref: '#/components/schemas/Object2'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} object_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0'
      );
    });

    it('Incompatible properties that are objects but not refs', async () => {
      const testDocument = makeCopy(rootDocument);

      const newDrinkSchema = makeCopy(testDocument.components.schemas['Drink']);
      const newJuiceSchema = makeCopy(testDocument.components.schemas['Juice']);

      testDocument.components.schemas['NewDrink'] = newDrinkSchema;
      testDocument.components.schemas['NewJuice'] = newJuiceSchema;

      testDocument.components.schemas[
        'DrinkCollection'
      ].allOf[1].properties.drinks.items.$ref = '#/components/schemas/NewDrink';
      newDrinkSchema.oneOf[0].$ref = '#/components/schemas/NewJuice';

      const objectSchema = {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'integer'
          }
        }
      };

      testDocument.components.schemas['NewDrink'].properties = {
        object_prop: objectSchema
      };

      newJuiceSchema.properties.object_prop = {
        allOf: [
          {
            objectSchema
          },
          {
            description: 'This makes the schema different.'
          }
        ]
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(`${expectedMsgProp} object_prop`);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.200.content.application/json.schema.allOf.1.properties.drinks.items.oneOf.0'
      );
    });
  });
});
