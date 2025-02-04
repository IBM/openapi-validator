/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { useDateBasedFormat } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = useDateBasedFormat;
const ruleId = 'ibm-use-date-based-format';
const expectedSeverity = severityCodes.warning;
const expectedNameMsg =
  'According to its name, this property should use type "string" and format "date" or "date-time"';
const expectedExampleMsg =
  'According to its example value, this schema should use type "string" and format "date" or "date-time"';

// To enable debug logging in the rule function, copy this statement to an it() block:
//    LoggerFactory.getInstance().addLoggerSetting(ruleId, 'debug');
// and uncomment this import statement:
// const LoggerFactory = require('../../src/utils/logger-factory');

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property ending in _at', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['created_at', 'modified_at', 'updated_at'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
            format,
          };
        });
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property ending in _on', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['created_on', 'modified_on', 'expires_on'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
            format,
          };
        });
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property containing the word "date"', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['first_date', 'new_date_when', 'date_next'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
            format,
          };
        });
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property containing the word "time"', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['a_time_for_updating', 'time_is'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
            format,
          };
        });
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property containing the word "timestamp"', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['photo_timestamp', 'photo_timestamp_value', 'timestamp_value'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'string',
              format,
            };
          }
        );
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property with a time-based name', async () => {
      const testDocument = makeCopy(rootDocument);
      ['date', 'date-time'].forEach(format => {
        ['created', 'updated', 'modified', 'expired', 'expires'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'string',
              format,
            };
          }
        );
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('top level date/time property with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.some_datetimeprop = {
        type: 'string',
        format: 'date-time',
        example: '1990-12-31T23:59:60Z',
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('nested date/time property with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.metadata = {
        type: 'object',
        properties: {
          some_datetimeprop: {
            type: 'string',
            format: 'date-time',
            example: 'July 3, 2023, 4:15 PM',
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('doubly nested date/time property with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.metadata = {
        type: 'object',
        properties: {
          modification_info: {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
                format: 'date-time',
                example: '2023-07-03T16:15:00+00:00',
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time items schema with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.changes = {
        type: 'array',
        items: {
          type: 'string',
          format: 'date-time',
          example: 'Mon, 03 Jul 23 16:15:00 +0000',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time dictionary schema with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.changes = {
        type: 'object',
        additionalProperties: {
          type: 'string',
          format: 'date-time',
          example: 'Monday, 03-Jul-23 16:15:00 GMT',
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time dictionary with null example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.changes = {
        type: 'object',
        example: {
          issues: [
            {
              metadata: null,
            },
          ],
        },
        properties: {
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                metadata: {
                  type: 'object',
                  additionalProperties: {
                    type: 'string',
                    format: 'date-time',
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

    it('primitive date/time oneOf schema with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.first_completed = {
        oneOf: [
          {
            type: 'string',
            format: 'date-time',
            example: '01/01/2023',
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('date/time property nested in oneOf schema with example', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.components.schemas.Movie.properties.metadata = {
        oneOf: [
          {
            type: 'object',
            properties: {
              first_completed: {
                type: 'string',
                format: 'date-time',
                example: 'Oct. 31',
              },
            },
          },
          {
            type: 'object',
            properties: {
              irrelevant: {
                type: 'boolean',
              },
            },
          },
        ],
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    describe('Should detect date times based on names', () => {
      it('string property ending in _at', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created_at', 'modified_at', 'updated_at'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created_at',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified_at',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.updated_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.updated_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.updated_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.updated_at',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property ending in _at', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created_at', 'modified_at', 'updated_at'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'integer',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created_at',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified_at',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.updated_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified_at',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.updated_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified_at',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.updated_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified_at',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.updated_at',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('string property ending in _on', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created_on', 'modified_on', 'expires_on'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created_on',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expires_on',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expires_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expires_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expires_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified_on',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property ending in _on', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created_on', 'modified_on', 'expires_on'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'integer',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created_on',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expires_on',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expires_on',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expires_on',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expires_on',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified_on',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('string property containing the word "date"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['first_date', 'new_date_when', 'date_next'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.date_next',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.first_date',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.new_date_when',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.date_next',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.first_date',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.new_date_when',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.date_next',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_date',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.new_date_when',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.date_next',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_date',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.new_date_when',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property containing the word "date"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['first_date', 'new_date_when', 'date_next'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'integer',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.date_next',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.first_date',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.new_date_when',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.date_next',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.first_date',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.new_date_when',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.date_next',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_date',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.new_date_when',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.date_next',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_date',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.new_date_when',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('string property containing the word "time"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['a_time_for_updating', 'time_is'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'string',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(8);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.a_time_for_updating',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.time_is',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.time_is',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.time_is',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.time_is',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property containing the word "time"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['a_time_for_updating', 'time_is'].forEach(propName => {
          testDocument.components.schemas.Movie.properties[propName] = {
            type: 'integer',
          };
        });

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(8);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.a_time_for_updating',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.time_is',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.time_is',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.time_is',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.a_time_for_updating',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.time_is',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('string property containing the word "timestamp"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['photo_timestamp', 'photo_timestamp_value', 'timestamp_value'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'string',
            };
          }
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.photo_timestamp',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.photo_timestamp_value',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.timestamp_value',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.timestamp_value',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.timestamp_value',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.timestamp_value',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property containing the word "timestamp"', async () => {
        const testDocument = makeCopy(rootDocument);
        ['photo_timestamp', 'photo_timestamp_value', 'timestamp_value'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'integer',
            };
          }
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(12);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.photo_timestamp',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.photo_timestamp_value',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.timestamp_value',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.timestamp_value',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.timestamp_value',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.photo_timestamp',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.photo_timestamp_value',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.timestamp_value',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('string property with a time-based name', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created', 'updated', 'modified', 'expired', 'expires'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'string',
            };
          }
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(20);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expired',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expires',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.updated',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expired',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expires',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.updated',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expired',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expires',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.updated',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expired',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expires',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.updated',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });

      it('integer property with a time-based name', async () => {
        const testDocument = makeCopy(rootDocument);
        ['created', 'updated', 'modified', 'expired', 'expires'].forEach(
          propName => {
            testDocument.components.schemas.Movie.properties[propName] = {
              type: 'integer',
            };
          }
        );

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(20);

        const expectedPaths = [
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.created',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expired',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.expires',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.modified',
          'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.updated',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.created',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expired',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.expires',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.modified',
          'paths./v1/movies.post.responses.201.content.application/json.schema.properties.updated',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.created',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expired',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.expires',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.modified',
          'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.updated',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.created',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expired',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.expires',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.modified',
          'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.updated',
        ];

        for (const i in results) {
          expect(results[i].code).toBe(ruleId);
          expect(results[i].message).toBe(expectedNameMsg);
          expect(results[i].severity).toBe(expectedSeverity);
          expect(results[i].path.join('.')).toBe(expectedPaths[i]);
        }
      });
    });

    describe('Should detect date times based on example values', () => {
      describe('primitive parameters', () => {
        it('parameter defined with schema, example in schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                example: '1990-12-31T23:59:60Z',
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = ['paths./v1/drinks.parameters.0.schema'];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with schema, example in example field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              example: '1990-12-31T23:59:60Z',
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = ['paths./v1/drinks.parameters.0.schema'];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with schema, example in examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              examples: {
                firstExample: {
                  value: '1990-12-31T23:59:60Z',
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = ['paths./v1/drinks.parameters.0.schema'];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with content, example in schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    example: '1990-12-31T23:59:60Z',
                  },
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/drinks.parameters.0.content.application/json.schema',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with content, example in example field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              example: '1990-12-31T23:59:60Z',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/drinks.parameters.0.content.application/json.schema',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with content, example in examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
              examples: {
                firstExample: {
                  value: '1990-12-31T23:59:60Z',
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/drinks.parameters.0.content.application/json.schema',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with content, example in content example field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                  example: '1990-12-31T23:59:60Z',
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/drinks.parameters.0.content.application/json.schema',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('parameter defined with content, example in content examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.paths['/v1/drinks'].parameters = [
            {
              name: 'some_datetime_param',
              in: 'query',
              required: false,
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                  examples: {
                    firstExample: {
                      value: '1990-12-31T23:59:60Z',
                    },
                  },
                },
              },
            },
          ];

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/drinks.parameters.0.content.application/json.schema',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('top level properties', () => {
        it('top level property with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.some_datetimeprop = {
            type: 'string',
            example: '1990-12-31T23:59:60Z',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('top level property with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.some_datetimeprop = {
            type: 'string',
          };

          testDocument.components.schemas.Movie.example = {
            some_datetimeprop: '1990-12-31T23:59:60Z',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('top level property with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.some_datetimeprop = {
            type: 'string',
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            some_datetimeprop: '1990-12-31T23:59:60Z',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('top level property with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.some_datetimeprop = {
            type: 'string',
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                some_datetimeprop: '1990-12-31T23:59:60Z',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('top level property with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.some_datetimeprop =
            {
              type: 'string',
            };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            some_datetimeprop: '1990-12-31T23:59:60Z',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('top level property with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.some_datetimeprop =
            {
              type: 'string',
            };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                some_datetimeprop: '1990-12-31T23:59:60Z',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('nested properties', () => {
        it('nested property with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
                example: 'July 3, 2023, 4:15 PM',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            example: {
              some_datetimeprop: 'July 3, 2023, 4:15 PM',
            },
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              some_datetimeprop: '1990-12-31T23:59:60Z',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              some_datetimeprop: 'July 3, 2023, 4:15 PM',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  some_datetimeprop: 'July 3, 2023, 4:15 PM',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              some_datetimeprop: 'July 3, 2023, 4:15 PM',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested property with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              some_datetimeprop: {
                type: 'string',
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  some_datetimeprop: 'July 3, 2023, 4:15 PM',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('doubly nested properties', () => {
        it('doubly nested property with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                    example: '2023-07-03T16:15:00+00:00',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                example: {
                  some_datetimeprop: '2023-07-03T16:15:00+00:00',
                },
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in grandparent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            example: {
              modification_info: {
                some_datetimeprop: '2023-07-03T16:15:00+00:00',
              },
            },
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              modification_info: {
                some_datetimeprop: '2023-07-03T16:15:00+00:00',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              modification_info: {
                some_datetimeprop: '2023-07-03T16:15:00+00:00',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  modification_info: {
                    some_datetimeprop: '2023-07-03T16:15:00+00:00',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              modification_info: {
                some_datetimeprop: '2023-07-03T16:15:00+00:00',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('doubly nested property with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              modification_info: {
                type: 'object',
                properties: {
                  some_datetimeprop: {
                    type: 'string',
                  },
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  modification_info: {
                    some_datetimeprop: '2023-07-03T16:15:00+00:00',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.modification_info.properties.some_datetimeprop',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('items schemas', () => {
        it('items schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
              example: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in array parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'array',
            example: ['Mon, 03 Jul 23 16:15:00 +0000'],
            items: {
              type: 'string',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
            },
          };

          testDocument.components.schemas.Movie.example = {
            changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('items schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'array',
            items: {
              type: 'string',
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('nested items schemas', () => {
        it('nested items schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in array parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                example: ['Mon, 03 Jul 23 16:15:00 +0000'],
                items: {
                  type: 'string',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in parent object', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            example: {
              changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
            },
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.items',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested items schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  changes: ['Mon, 03 Jul 23 16:15:00 +0000'],
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.changes.items',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('dictionary schemas - additionalProperties', () => {
        it('dictionary schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            example: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
            additionalProperties: {
              type: 'string',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in the value schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
              example: 'Monday, 03-Jul-23 16:15:00 GMT',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          };

          testDocument.components.schemas.Movie.example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: {
                  whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('dictionary schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: {
                  whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('dictionary schemas - patternProperties', () => {
        it('patterned dictionary schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            example: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in the value schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
                example: 'Monday, 03-Jul-23 16:15:00 GMT',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          testDocument.components.schemas.Movie.example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: {
                  whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            changes: {
              whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('patterned dictionary schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.changes = {
            type: 'object',
            patternProperties: {
              '^what.*$': {
                type: 'string',
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                changes: {
                  whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.changes.patternProperties.^what.*$',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('nested dictionary schemas', () => {
        it('nested dictionary schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                example: {
                  whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                },
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in the value schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  example: 'Mon, 03 Jul 23 16:15:00 +0000',
                  type: 'string',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in parent object', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            example: {
              changes: {
                whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
              },
            },
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              changes: {
                whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              changes: {
                whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  changes: {
                    whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              changes: {
                whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('nested dictionary schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  changes: {
                    whatever: 'Mon, 03 Jul 23 16:15:00 +0000',
                  },
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.properties.changes.additionalProperties',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('primitive oneOf schemas', () => {
        it('primitive oneOf schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.first_completed = {
            oneOf: [
              {
                type: 'string',
                example: '01/01/2023',
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.first_completed = {
            example: '01/01/2023',
            oneOf: [
              {
                type: 'string',
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.first_completed = {
            oneOf: [
              {
                type: 'string',
              },
            ],
          };

          testDocument.components.schemas.Movie.example = {
            first_completed: '01/01/2023',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.first_completed = {
            oneOf: [
              {
                type: 'string',
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            first_completed: '01/01/2023',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.first_completed = {
            oneOf: [
              {
                type: 'string',
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                first_completed: '01/01/2023',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.first_completed =
            {
              oneOf: [
                {
                  type: 'string',
                },
              ],
            };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            first_completed: '01/01/2023',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('primitive oneOf schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.first_completed =
            {
              oneOf: [
                {
                  type: 'string',
                },
              ],
            };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                first_completed: '01/01/2023',
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('properties nested in oneOf schema', () => {
        it('property nested in oneOf schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                    example: 'Oct. 31',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            example: {
              first_completed: 'Oct. 31',
            },
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  first_completed: 'Oct. 31',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            oneOf: [
              {
                type: 'object',
                properties: {
                  first_completed: {
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  first_completed: 'Oct. 31',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.oneOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('properties nested in nested oneOf schema', () => {
        it('property nested in nested oneOf schema with its own example', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                        example: 'Oct. 31',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in parent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    example: {
                      first_completed: 'Oct. 31',
                    },
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in grandparent', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                example: {
                  first_completed: 'Oct. 31',
                },
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example at top level', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            example: {
              first_completed: 'Oct. 31',
            },
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in oneOf schema with example in primary schema', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.schemas.Movie.example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in response body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in response body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.components.responses.MovieWithETag.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  first_completed: 'Oct. 31',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);

          const expectedPaths = [
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in request body', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].example = {
            metadata: {
              first_completed: 'Oct. 31',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('property nested in nested oneOf schema with example in request body examples field', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.MoviePrototype.properties.metadata = {
            oneOf: [
              {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      first_completed: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      something_else: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
              {
                type: 'object',
                properties: {
                  irrelevant: {
                    type: 'boolean',
                  },
                },
              },
            ],
          };

          testDocument.paths['/v1/movies'].post.requestBody.content[
            'application/json'
          ].examples = {
            firstExample: {
              value: {
                metadata: {
                  first_completed: 'Oct. 31',
                },
              },
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);

          const expectedPaths = [
            'paths./v1/movies.post.requestBody.content.application/json.schema.properties.metadata.oneOf.0.anyOf.0.properties.first_completed',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });

      describe('edge cases', () => {
        it('schema has property with same name as sub-schema property', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.studio = {
            type: 'object',
            properties: {
              made: {
                type: 'string',
              },
            },
            example: {
              made: '2024-12-19',
            },
          };

          testDocument.components.schemas.Movie.properties.made = {
            type: 'string',
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.studio.properties.made',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.studio.properties.made',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.studio.properties.made',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.studio.properties.made',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('schema has example defined within allOf', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.made = {
            type: 'string',
            allOf: [
              {
                example: '2024-12-19',
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.made',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.made',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.made',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.made',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });

        it('schema property has example defined within anyOf sibling', async () => {
          const testDocument = makeCopy(rootDocument);
          testDocument.components.schemas.Movie.properties.studio = {
            type: 'object',
            properties: {
              made: {
                type: 'string',
              },
            },
            anyOf: [
              {
                example: {
                  made: '2024-12-19',
                },
              },
            ],
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(4);

          const expectedPaths = [
            'paths./v1/movies.get.responses.200.content.application/json.schema.allOf.1.properties.movies.items.properties.studio.properties.made',
            'paths./v1/movies.post.responses.201.content.application/json.schema.properties.studio.properties.made',
            'paths./v1/movies/{movie_id}.get.responses.200.content.application/json.schema.properties.studio.properties.made',
            'paths./v1/movies/{movie_id}.put.responses.200.content.application/json.schema.properties.studio.properties.made',
          ];

          for (const i in results) {
            expect(results[i].code).toBe(ruleId);
            expect(results[i].message).toBe(expectedExampleMsg);
            expect(results[i].severity).toBe(expectedSeverity);
            expect(results[i].path.join('.')).toBe(expectedPaths[i]);
          }
        });
      });
    });
  });
});
