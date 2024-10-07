/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');
let rule = require('../../src/rules').propertyConsistentNameAndType;

const ruleId = 'ibm-property-consistent-name-and-type';

// this rule is turned off by default - enable it to run tests
// but still verify it is defined in the rule as "off"
const originalSeverity = makeCopy(rule.severity);
rule.severity = 'warn';

const expectedSeverity = severityCodes.warning;

describe(`Spectral rule: ${ruleId}`, () => {
  // this is required because of the "global" variable we are using in the file
  // that holds the implementation for this rule. By default, it will maintain
  // its list of "visited properties" between tests, which prevents proper
  // isolation between the tests. this will reset that variable after each test
  afterEach(() => {
    jest.resetModules();
    rule = require('../../src/rules').propertyConsistentNameAndType;
    rule.severity = 'warn';
  });

  it('Should originally be set to severity: "off"', () => {
    expect(originalSeverity).toBe('off');
  });

  describe('Should not yield errors', () => {
    it('should not error with clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('should not error if inconsistent property is deprecated', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/movies'].post.requestBody.content[
        'application/json'
      ].schema = {
        type: 'object',
        description: 'alternate movie schema',
        properties: {
          message: {
            type: 'integer',
            description: 'Main message of the movie.',
            deprecated: true,
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('should not error if inconsistent property is excluded - code', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    code: {
                      type: 'integer',
                      description: 'Integer code',
                    },
                  },
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/songs'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'song schema',
                  properties: {
                    code: {
                      type: 'boolean',
                      description: 'Boolean code',
                    },
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

    it('should not error if inconsistent property is excluded - default', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    default: {
                      type: 'integer',
                      description: 'Integer default',
                    },
                  },
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/songs'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'song schema',
                  properties: {
                    default: {
                      type: 'boolean',
                      description: 'Boolean default',
                    },
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

    it('should not error if inconsistent property is excluded - type', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    type: {
                      type: 'integer',
                      description: 'Integer type',
                    },
                  },
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/songs'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'song schema',
                  properties: {
                    type: {
                      type: 'boolean',
                      description: 'Boolean type',
                    },
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

    it('should not error if inconsistent property is excluded - value', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    value: {
                      type: 'integer',
                      description: 'Integer value',
                    },
                  },
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/songs'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'song schema',
                  properties: {
                    value: {
                      type: 'boolean',
                      description: 'Boolean value',
                    },
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
  });

  describe('Should yield errors', () => {
    it('should error if two properties have the same name but different types', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    running_time: {
                      type: 'string',
                      description: 'Running time of the audiobook form.',
                    },
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);

      expect(results).toHaveLength(2);

      let validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        'Properties with the same name have inconsistent types: running_time'
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.application/json.schema.properties.running_time'
      );
      expect(validation.severity).toBe(expectedSeverity);

      validation = results[1];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        'Properties with the same name have inconsistent types: running_time'
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/books.post.requestBody.content.application/json.schema.properties.running_time'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });

    it('should only flag first inconsistent property once and should flag all that follow', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.paths['/v1/books'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'book schema',
                  properties: {
                    running_time: {
                      type: 'string',
                      description: 'Running time of the audiobook form.',
                    },
                  },
                },
              },
            },
          },
        },
      };

      testDocument.paths['/v1/songs'] = {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'song schema',
                  properties: {
                    running_time: {
                      type: 'boolean',
                      description: 'Running time of the song.',
                    },
                  },
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);

      expect(results).toHaveLength(3);

      let validation = results[0];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        'Properties with the same name have inconsistent types: running_time'
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/movies.post.requestBody.content.application/json.schema.properties.running_time'
      );
      expect(validation.severity).toBe(expectedSeverity);

      validation = results[1];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        'Properties with the same name have inconsistent types: running_time'
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/books.post.requestBody.content.application/json.schema.properties.running_time'
      );
      expect(validation.severity).toBe(expectedSeverity);

      validation = results[2];
      expect(validation.code).toBe(ruleId);
      expect(validation.message).toBe(
        'Properties with the same name have inconsistent types: running_time'
      );
      expect(validation.path.join('.')).toBe(
        'paths./v1/songs.post.requestBody.content.application/json.schema.properties.running_time'
      );
      expect(validation.severity).toBe(expectedSeverity);
    });
  });
});
