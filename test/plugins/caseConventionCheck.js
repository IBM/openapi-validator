const expect = require('expect');
const checkCase = require('../../src/plugins/utils/caseConventionCheck');

describe('case convention regex tests', function() {
  describe('lower snake case tests', function() {
    const convention = 'lower_snake_case';

    it('sha1 is snake case', function() {
      const string = 'sha1';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('good_case_string is snake case', function() {
      const string = 'good_case_string';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('badCaseString is NOT snake case', function() {
      const string = 'badCaseString';
      expect(checkCase(string, convention)).toEqual(false);
    });
  });

  describe('upper camel case tests', function() {
    const convention = 'upper_camel_case';
    it('Sha1 is upper camel case', function() {
      const string = 'Sha1';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('GoodCaseString is upper camel case', function() {
      const string = 'GoodCaseString';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('badCaseString is NOT upper camel case', function() {
      const string = 'badCaseString';
      expect(checkCase(string, convention)).toEqual(false);
    });

    it('does not hang on long identifiers', function() {
      const string = 'downloadGeneratedApplicationUsingGET';
      expect(checkCase(string, convention)).toEqual(false);
    });
  });

  describe('lower camel case tests', function() {
    const convention = 'lower_camel_case';
    it('sha1 is lower camel case', function() {
      const string = 'sha1';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('goodCaseString is lower camel case', function() {
      const string = 'goodCaseString';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('BadCaseString is NOT lower camel case', function() {
      const string = 'BadCaseString';
      expect(checkCase(string, convention)).toEqual(false);
    });

    it('does not hang on long identifiers', function() {
      const string = 'downloadGeneratedApplicationUsingGET';
      expect(checkCase(string, convention)).toEqual(false);
    });
  });

  describe('lower dash case tests', function() {
    const convention = 'lower_dash_case';
    it('sha1 is lower dash case', function() {
      const string = 'sha1';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('good-case-string is lower dash case', function() {
      const string = 'good-case-string';
      expect(checkCase(string, convention)).toEqual(true);
    });

    it('Bad-Case-String is NOT lower dash case', function() {
      const string = 'Bad-Case-String';
      expect(checkCase(string, convention)).toEqual(false);
    });
  });
});
