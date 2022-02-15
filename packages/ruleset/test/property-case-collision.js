const { propertyCaseCollision } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const name = 'property-case-collision';

describe('Spectral rule: property-case-collision', () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(name, propertyCaseCollision, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should return an error when two property names of different case conventions are identical if converted to a single case', async () => {
    const testDocument = makeCopy(rootDocument);

    testDocument.components.schemas.Movie.properties.IMDBRating = {
      type: 'string'
    };
    testDocument.components.schemas.Movie.properties.IDMB_rating = {
      type: 'string'
    };

    const results = await testRule(name, propertyCaseCollision, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(name);
    expect(validation.message).toBe(
      'Property name is identical to another property except for the naming convention: IMDB_rating'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      'components',
      'schemas',
      'Movie',
      'properties',
      'IMDB_rating'
    ]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
