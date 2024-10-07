/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { securitySchemeAttributes } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const rule = securitySchemeAttributes;
const ruleId = 'ibm-security-scheme-attributes';
const expectedSeverity = severityCodes.error;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('No security schemes or security reqmt objects', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.components.securitySchemes;
      delete testDocument.security;
      delete testDocument.paths['/v1/drinks'].post.security;
      delete testDocument.paths['/v1/drinks'].get.security;
      delete testDocument.paths['/v1/drinks/{drink_id}'].get.security;
      delete testDocument.paths['/v1/movies'].post.security;
      delete testDocument.paths['/v1/movies'].get.security;
      delete testDocument.paths['/v1/cars'].post.security;
      delete testDocument.paths['/v1/cars/{car_id}'].get.security;

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Relative URLs within security schemes', async () => {
      const testDocument = makeCopy(rootDocument);
      const flows = testDocument.components.securitySchemes.DrinkScheme.flows;
      flows.implicit.authorizationUrl = '/relative/url';
      flows.authorizationCode.tokenUrl = '/relative/url';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('Relative URLs with base url that ends in backslash', async () => {
      const testDocument = makeCopy(rootDocument);
      testDocument.servers[0].url = 'https://some-madeup-url.com/api/';

      const flows = testDocument.components.securitySchemes.DrinkScheme.flows;
      flows.implicit.authorizationUrl = '/relative/url';
      flows.authorizationCode.tokenUrl = '/relative/url';

      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    describe('Miscellaneous errors', () => {
      it('Missing type property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.MovieScheme = {
          name: 'Authorization',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme is missing required property: type`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.MovieScheme'
        );
      });
      it('Invalid type property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.MovieScheme = {
          type: 'bad type',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme property 'type' must be one of: apiKey, http, oauth2, openIdConnect`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.MovieScheme.type'
        );
      });
    });
    describe('http errors', () => {
      it('Missing scheme property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.Basic = {
          type: 'http',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme with type 'http' is missing required property: scheme`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.Basic'
        );
      });
    });
    describe('apiKey errors', () => {
      it('Missing in property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.IAM = {
          type: 'apiKey',
          name: 'Authorization',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme with type 'apiKey' is missing required property: in`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.IAM'
        );
      });
      it('Invalid in property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.IAM = {
          type: 'apiKey',
          name: 'Authorization',
          in: 'bad-value',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme property 'in' must be one of: query, header, cookie`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.IAM.in'
        );
      });
      it('Missing name property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.IAM = {
          type: 'apiKey',
          in: 'header',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme with type 'apiKey' is missing required property: name`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.IAM'
        );
      });
    });
    describe('openIdConnect errors', () => {
      it('Missing openIdConnectUrl property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.OpenIdScheme = {
          type: 'openIdConnect',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme with type 'openIdConnect' is missing required property: openIdConnectUrl`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.OpenIdScheme'
        );
      });
      it('Invalid openIdConnectUrl property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.OpenIdScheme = {
          type: 'openIdConnect',
          openIdConnectUrl: 'not a valid URL',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme property 'openIdConnectUrl' must be a valid URL`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.OpenIdScheme.openIdConnectUrl'
        );
      });
    });
    describe('oauth2 errors', () => {
      it('Missing flows property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.DrinkScheme = {
          type: 'oauth2',
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `Security scheme with type 'oauth2' is missing required property: flows`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.DrinkScheme'
        );
      });
      it('Empty flows property', async () => {
        const testDocument = makeCopy(rootDocument);

        testDocument.components.securitySchemes.DrinkScheme = {
          type: 'oauth2',
          flows: {},
        };

        const results = await testRule(ruleId, rule, testDocument);
        expect(results).toHaveLength(1);
        expect(results[0].code).toBe(ruleId);
        expect(results[0].message).toBe(
          `oauth2 flow object must specify one or more of the following properties: implicit, password, clientCredentials or authorizationCode`
        );
        expect(results[0].severity).toBe(expectedSeverity);
        expect(results[0].path.join('.')).toBe(
          'components.securitySchemes.DrinkScheme.flows'
        );
      });
      describe('oauth2 implicit errors', () => {
        it('Empty implicit flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.implicit =
            {};

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);
          for (const r of results) {
            expect(r.code).toBe(ruleId);
            expect(r.severity).toBe(expectedSeverity);
            expect(r.path.join('.')).toBe(
              'components.securitySchemes.DrinkScheme.flows.implicit'
            );
          }
          expect(results[0].message).toBe(
            `oauth2 'implicit' flow is missing required property: authorizationUrl`
          );
          expect(results[1].message).toBe(
            `oauth2 'implicit' flow is missing required property: scopes`
          );
        });
        it('Invalid implicit flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.implicit = {
            authorizationUrl: 'bad url',
            scopes: {
              mixologist: 'Can create Drinks',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);
          expect(results[0].code).toBe(ruleId);
          expect(results[0].severity).toBe(expectedSeverity);
          expect(results[0].message).toBe(
            `Security scheme property 'authorizationUrl' must be a valid URL`
          );
          expect(results[0].path.join('.')).toBe(
            'components.securitySchemes.DrinkScheme.flows.implicit.authorizationUrl'
          );
        });
      });
      describe('oauth2 authorizationCode errors', () => {
        it('Empty authorizationCode flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.authorizationCode =
            {};

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(3);
          for (const r of results) {
            expect(r.code).toBe(ruleId);
            expect(r.severity).toBe(expectedSeverity);
            expect(r.path.join('.')).toBe(
              'components.securitySchemes.DrinkScheme.flows.authorizationCode'
            );
          }
          expect(results[0].message).toBe(
            `oauth2 'authorizationCode' flow is missing required property: tokenUrl`
          );
          expect(results[1].message).toBe(
            `oauth2 'authorizationCode' flow is missing required property: authorizationUrl`
          );
          expect(results[2].message).toBe(
            `oauth2 'authorizationCode' flow is missing required property: scopes`
          );
        });
        it('Invalid authorizationCode flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.authorizationCode =
            {
              authorizationUrl: 'bad url',
              tokenUrl: 'bad url',
              scopes: {
                mixologist: 'Can create Drinks',
              },
            };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);
          for (const r of results) {
            expect(r.code).toBe(ruleId);
            expect(r.severity).toBe(expectedSeverity);
          }
          expect(results[0].message).toBe(
            `Security scheme property 'authorizationUrl' must be a valid URL`
          );
          expect(results[0].path.join('.')).toBe(
            'components.securitySchemes.DrinkScheme.flows.authorizationCode.authorizationUrl'
          );
          expect(results[1].message).toBe(
            `Security scheme property 'tokenUrl' must be a valid URL`
          );
          expect(results[1].path.join('.')).toBe(
            'components.securitySchemes.DrinkScheme.flows.authorizationCode.tokenUrl'
          );
        });
      });
      describe('oauth2 clientCredentials errors', () => {
        it('Empty clientCredentials flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.clientCredentials =
            {};

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);
          for (const r of results) {
            expect(r.code).toBe(ruleId);
            expect(r.severity).toBe(expectedSeverity);
            expect(r.path.join('.')).toBe(
              'components.securitySchemes.DrinkScheme.flows.clientCredentials'
            );
          }
          expect(results[0].message).toBe(
            `oauth2 'clientCredentials' flow is missing required property: tokenUrl`
          );
          expect(results[1].message).toBe(
            `oauth2 'clientCredentials' flow is missing required property: scopes`
          );
        });
        it('Invalid clientCredentials flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.clientCredentials =
            {
              tokenUrl: 'bad url',
              scopes: {
                mixologist: 'Can create Drinks',
              },
            };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);
          expect(results[0].code).toBe(ruleId);
          expect(results[0].severity).toBe(expectedSeverity);
          expect(results[0].message).toBe(
            `Security scheme property 'tokenUrl' must be a valid URL`
          );
          expect(results[0].path.join('.')).toBe(
            'components.securitySchemes.DrinkScheme.flows.clientCredentials.tokenUrl'
          );
        });
      });
      describe('oauth2 password errors', () => {
        it('Empty password flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.password =
            {};

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(2);
          for (const r of results) {
            expect(r.code).toBe(ruleId);
            expect(r.severity).toBe(expectedSeverity);
            expect(r.path.join('.')).toBe(
              'components.securitySchemes.DrinkScheme.flows.password'
            );
          }
          expect(results[0].message).toBe(
            `oauth2 'password' flow is missing required property: tokenUrl`
          );
          expect(results[1].message).toBe(
            `oauth2 'password' flow is missing required property: scopes`
          );
        });
        it('Invalid password flow', async () => {
          const testDocument = makeCopy(rootDocument);

          testDocument.components.securitySchemes.DrinkScheme.flows.password = {
            tokenUrl: 'bad url',
            scopes: {
              mixologist: 'Can create Drinks',
            },
          };

          const results = await testRule(ruleId, rule, testDocument);
          expect(results).toHaveLength(1);
          expect(results[0].code).toBe(ruleId);
          expect(results[0].severity).toBe(expectedSeverity);
          expect(results[0].message).toBe(
            `Security scheme property 'tokenUrl' must be a valid URL`
          );
          expect(results[0].path.join('.')).toBe(
            'components.securitySchemes.DrinkScheme.flows.password.tokenUrl'
          );
        });
      });
    });
  });
});
