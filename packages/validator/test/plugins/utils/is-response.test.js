const expect = require('expect');
const { isResponseObject } = require('../../../src/plugins/utils');

describe('is response object - util', () => {
  describe('OpenAPI 3', () => {
    const isOas3 = true;

    it('should return false for top-level responses objects', () => {
      const path = ['responses'];
      expect(isResponseObject(path, isOas3)).toBe(false);
    });

    it('should return true for components responses objects', () => {
      const path = ['components', 'responses'];

      // the second argument, `isOas3`, is optional. test that optionality
      expect(isResponseObject(path)).toBe(true);
    });

    it('should return true for operation responses', () => {
      const path = ['paths', '/resource', 'post', 'responses'];
      expect(isResponseObject(path, isOas3)).toBe(true);
    });

    it('should return false for non responses', () => {
      const path = ['paths', '/resource', 'post', 'parameters'];
      expect(isResponseObject(path, isOas3)).toBe(false);
    });

    it('should return false for schemas with properties named responses', () => {
      const path = [
        'components',
        'schemas',
        'MySchema',
        'properties',
        'responses'
      ];
      expect(isResponseObject(path, isOas3)).toBe(false);
    });
  });

  describe('Swagger 2', () => {
    const isOas3 = false;

    it('should return true for top-level responses objects', () => {
      const path = ['responses'];
      expect(isResponseObject(path, isOas3)).toBe(true);
    });

    it('should return false for components responses objects', () => {
      const path = ['components', 'responses'];
      expect(isResponseObject(path, isOas3)).toBe(false);
    });
  });
});
