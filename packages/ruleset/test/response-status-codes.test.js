const { responseStatusCodes } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const rule = responseStatusCodes;
const ruleId = 'response-status-codes';
const expectedSeverity = severityCodes.warning;

describe('Spectral rule: response-status-codes', () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    it('101 with no 2xx codes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses = {
        '101': {
          description: 'protocol-switching response'
        }
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST non-"create" w/201', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('POST non-"create" w/202', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';
      testDocument.paths['/v1/drinks'].post.responses['202'] = {
        description: 'Request to create new resource was accepted'
      };
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('non-POST "create" w/201', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';
      testDocument.paths['/v1/drinks'].get.responses['201'] =
        testDocument.paths['/v1/drinks'].get.responses['200'];
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });

    it('non-POST "create" w/202', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';
      testDocument.paths['/v1/drinks'].get.responses['202'] = {
        description: 'Request to create new resource was accepted'
      };
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(0);
    });
  });

  describe('Should yield errors', () => {
    it('422 status code should be 400', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['422'] =
        testDocument.paths['/v1/drinks'].post.responses['400'];
      delete testDocument.paths['/v1/drinks'].post.responses['400'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation `responses` should use status code 400 instead of 422 for invalid request payloads.'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.422'
      );
    });

    it('302 status code should be 303 or 307', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['302'] = {
        description: 'response for "Found"'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation `responses` should use status code 303 or 307 instead of 302.'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.302'
      );
    });

    it('101 status code along with 2xx codes', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.responses['101'] = {
        description: 'protocol switcheroo'
      };

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation `responses` should not include status code 101 when success status codes (2xx) are present.'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.post.responses.101'
      );
    });

    it('204 status code with response content', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.responses['204'] =
        testDocument.paths['/v1/drinks'].get.responses['200'];
      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'A 204 response must not include a response body. Use a different status code for responses with content.'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe(
        'paths./v1/drinks.get.responses.204.content'
      );
    });

    it('No success status codes', async () => {
      const testDocument = makeCopy(rootDocument);

      delete testDocument.paths['/v1/drinks'].get.responses['200'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        'Operation `responses` should include at least one success status code (2xx).'
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.get.responses');
    });

    it('non-POST "create" operation with no 201/202 status code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].get.operationId = 'create_drink';

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        "A 201 or 202 status code should be returned by a 'create' operation."
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.get.responses');
    });

    it('POST non-"create" operation with no 201/202 status code', async () => {
      const testDocument = makeCopy(rootDocument);

      testDocument.paths['/v1/drinks'].post.operationId = 'pour_drink';
      testDocument.paths['/v1/drinks'].post.responses['200'] =
        testDocument.paths['/v1/drinks'].post.responses['201'];
      delete testDocument.paths['/v1/drinks'].post.responses['201'];

      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(1);

      expect(results[0].code).toBe(ruleId);
      expect(results[0].message).toBe(
        "A 201 or 202 status code should be returned by a 'create' operation."
      );
      expect(results[0].severity).toBe(expectedSeverity);
      expect(results[0].path.join('.')).toBe('paths./v1/drinks.post.responses');
    });
  });
});
