const { securitySchemes } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = securitySchemes;
const ruleId = 'security-schemes';
const expectedSeverity = severityCodes.warning;
const expectedMsgUndefinedScheme = 'An undefined security scheme is referenced';
const expectedMsgUndefinedScope = 'An undefined security scope is referenced';
const expectedMsgUnusedScheme = 'A security scheme is defined but never used';
const expectedMsgUnusedScope = 'A security scope is defined but never used';
const expectedMsgScopesNotSupported =
  'For security scheme types that do not support scopes, the value must be an empty array';

describe('Spectral rule: security-schemes', () => {
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

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('No securitySchemes defined', async () => {
      const testDocument = makeCopy(rootDocument);

      // Remove all the security schemes.
      delete testDocument.components.securitySchemes;

      // All references to security schemes should now be flagged as undefined.
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(8);
      for (const r of results) {
        expect(r.code).toBe(ruleId);
        expect(r.message).toBe(expectedMsgUndefinedScheme);
        expect(r.severity).toBe(expectedSeverity);
      }

      expect(results[0].path.join('.')).toBe('security.0.IAM');
      expect(results[1].path.join('.')).toBe('security.1.OpenIdScheme');
      expect(results[2].path.join('.')).toBe(
        'paths./v1/drinks.post.security.0.DrinkScheme'
      );
      expect(results[3].path.join('.')).toBe(
        'paths./v1/drinks.get.security.0.Basic'
      );
      expect(results[4].path.join('.')).toBe(
        'paths./v1/drinks.get.security.0.DrinkScheme'
      );
      expect(results[5].path.join('.')).toBe(
        'paths./v1/drinks/{drink_id}.get.security.0.DrinkScheme'
      );
      expect(results[6].path.join('.')).toBe(
        'paths./v1/movies.post.security.0.MovieScheme'
      );
      expect(results[7].path.join('.')).toBe(
        'paths./v1/movies.get.security.0.MovieScheme'
      );
    });

    it('Reference to undefined security scheme - global', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "InvalidScheme" to the global security list.
      testDocument.security.push({
        InvalidScheme: []
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUndefinedScheme);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('security.2.InvalidScheme');
    });

    it('Reference to undefined security scheme - operation', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "InvalidScheme" to an existing security list.
      testDocument.paths['/v1/drinks'].get.security.push({
        InvalidScheme: []
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUndefinedScheme);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.security.1.InvalidScheme'
      );
    });

    it('Reference to undefined oath2 scope - global', async () => {
      const testDocument = makeCopy(rootDocument);

      // Reference undefined scope in global security requirement object.
      testDocument.security.push({
        DrinkScheme: ['brewer']
      });

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUndefinedScope);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('security.2.DrinkScheme.0');
    });

    it('Reference to undefined oath2 scope - operation', async () => {
      const testDocument = makeCopy(rootDocument);

      // Reference undefined scope in operation-level security requirement object.
      testDocument.paths['/v1/movies'].post.security[0].MovieScheme.push(
        'producer'
      );

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUndefinedScope);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/movies.post.security.0.MovieScheme.1'
      );
    });

    it('Unused security scheme', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "UnusedScheme" to components.securitySchemes.
      testDocument.components.securitySchemes.UnusedScheme = {
        in: 'header',
        name: 'Authorization',
        type: 'http',
        scheme: 'Basic'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUnusedScheme);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.securitySchemes.UnusedScheme'
      );
    });

    it('Unused oauth2 scope', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "producer" scope to "MovieScheme" security scheme.
      testDocument.components.securitySchemes.MovieScheme.flows.authorizationCode.scopes[
        'producer'
      ] = 'Can produce Movies';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUnusedScope);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.securitySchemes.MovieScheme.flows.authorizationCode.scopes.producer'
      );
    });

    it('Unused oauth2 scope - name collision', async () => {
      const testDocument = makeCopy(rootDocument);

      // Add "drinker" scope to "MovieScheme" security scheme.
      // We'll now have two different schemes that define the "drinker" scope.
      // This should cause an error since the MovieScheme "drinker" scope will be unused.
      testDocument.components.securitySchemes.MovieScheme.flows.implicit.scopes[
        'drinker'
      ] = 'Can consume beverages';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgUnusedScope);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'components.securitySchemes.MovieScheme.flows.implicit.scopes.drinker'
      );
    });

    it('Use scope with scheme type that doesnt support scopes', async () => {
      const testDocument = makeCopy(rootDocument);

      // Set a scope for a scheme type that doesn't support scopes.
      testDocument.security[0].IAM = ['notascope'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);
      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(expectedMsgScopesNotSupported);
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('security.0.IAM');
    });
  });
});
