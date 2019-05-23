const config = require('../../../../src/.defaultsForValidator').defaults.shared;
const expect = require('expect');
const {
  validate
} = require('../../../../src/plugins/validation/2and3/semantic-validators/info');

describe('validation plugin - semantic - error handling for incorrect formatting', () => {
  describe('there should be errors when the defintion is missing neccesrry fields', function() {
    //this is for openapi object
    it('should return an error when a parameter does not have info', () => {
      const spec = {
        Openapi: '3.0.0'
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info']);
      expect(res.errors[0].message).toEqual(
        'Missing info object for api defintion'
      );
    });
    it('should return an error when a title and version is not a string', () => {
      const spec = {
        Openapi: '3.0.0',
        info: {
          title: 32,
          version: '32'
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info', 'title']);
      expect(res.errors[0].message).toEqual(
        ' Info object is missng the title field'
      );
    });
    it('should return an error when a title and version is not a string', () => {
      const spec = {
        Openapi: '3.0.0',
        info: {
          title: '32',
          version: 32
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info', 'version']);
      expect(res.errors[0].message).toEqual(
        ' Info object is missng the version field'
      );
    });
    it('should return an error when a title is missing', () => {
      const spec = {
        Openapi: '3.0.0',
        info: {
          version: '32'
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info', 'title']);
      expect(res.errors[0].message).toEqual(
        ' Info object is missng the title field'
      );
    });
    it('should return an error when a version is missing', () => {
      const spec = {
        Openapi: '3.0.0',
        info: {
          title: '32'
        }
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info', 'version']);
      expect(res.errors[0].message).toEqual(
        ' Info object is missng the version field'
      );
    });
    it('should return an error when a info is not defined as a proper object', () => {
      const spec = {
        Openapi: '3.0.0',
        info: 'abc'
      };

      const res = validate({ jsSpec: spec }, config);
      expect(res.errors.length).toEqual(1);
      expect(res.errors[0].path).toEqual(['info']);
      expect(res.errors[0].message).toEqual(
        'Info is an obect and must have properties'
      );
    });
  });
});
