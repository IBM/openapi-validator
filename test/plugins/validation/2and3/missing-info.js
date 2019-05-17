const config = require('../../../../src/.defaultsForValidator').defaults.shared;
const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/missing-info');

describe('validation plugin - semantic - error handling for incorrect formatting', () => {
  describe('there should be errors when the defintion is missing neccesrry fields', function() {
    //this is for openapi object
    it('should return an error when a parameter does not have info', () => {
      const spec = {
        Openapi: '3.0.0'
      };

      const res = validate({ jsSpec: spec }, config);
      //expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info']);
      expect(res.errors[0].message).toEqual(
        'Missing info object for api defintion'
      );
    });
    it('should return an error when a title and version are not strings', () => {
      const spec = {
        Openapi: '3.0.0',
        info: {
          title: 32,
          version: 1
        }
      };

      const res = validate({ jsSpec: spec }, config);
      //expect(res.warnings.length).toEqual(0);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info', 'title']);
      expect(res.errors[0].message).toEqual(
        'Info object missing proper definitions for title or version properties'
      );
    });
  });
});
