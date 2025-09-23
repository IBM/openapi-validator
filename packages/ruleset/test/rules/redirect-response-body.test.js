/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { redirectResponseBody } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = redirectResponseBody;
const ruleId = 'ibm-redirect-response-body';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('301 with response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'remote_region',
            message: 'The requested resource is in a different region',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('302 with response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['302'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
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

    it('305 with response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['305'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
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

    it('307 with response body', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['307'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
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
  });

  describe('Should yield errors', () => {
    it('Operation has response body (for 309)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['309'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Only a 301, 302, 305, 307 response should include a response body'
      );
      expect(results[0].severity).toBe(expectedSeverity);
    });

    it('Operation is missing code field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Response body for response codes 301, 302, 305 and 307 should include "code" field'
      );
      expect(results[0].severity).toBe(expectedSeverity);
    });

    it('Operation is missing message field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Response body for response codes 301, 302, 305 and 307 should include "message" field'
      );
      expect(results[0].severity).toBe(expectedSeverity);
    });

    it('Operation is missing target field', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'resolved',
            message: 'The requested resource is resolved',
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Response body for response codes 301, 302, 305 and 307 should include "target" field'
      );
      expect(results[0].severity).toBe(expectedSeverity);
    });

    it('Code field has invalid attribute)', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/cars/{car_id}'].patch.responses['301'] = {
        description: 'Only partial data',
        content: {
          'application/json': {
            code: 'cat',
            message: 'The requested resource is resolved',
            target: {
              crn: 'crn:v1:bluemix:public:is:us-south-1:a/aa2432b1fa4d4ace891e9b80fc104e34::share:r134-a0c07083-f411-446c-9316-7b08d6448c86',
              href: 'https://us-south.iaas.cloud.ibm.com/v1/shares/r134-a0c07083-f411-446c-9316-7b08d6448c86',
              id: 'r134-a0c07083-f411-446c-9316-7b08d6448c86',
              name: 'my-share',
              remote: {
                region: {
                  href: 'https://us-east.iaas.cloud.ibm.com/v1/regions/us-south',
                  name: 'us-south',
                  resource_type: 'region',
                },
              },
              resource_type: 'share',
            },
            schema: {
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
        },
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toContain(
        'Redirect code should match one of the following:'
      );
      expect(results[0].severity).toBe(expectedSeverity);
    });
  });
});
