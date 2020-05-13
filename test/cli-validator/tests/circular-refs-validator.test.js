const commandLineValidator = require('../../../src/cli-validator/runValidator');
const circularRefsValidator = require('../../../src/cli-validator/utils/circular-references-ibm');
const { getCapturedText } = require('../../test-utils');

describe('cli tool - test circular reference module', function() {
  it('should correctly validate a file with circular references', async function() {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/circular-refs.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    consoleSpy.mockRestore();

    expect(exitCode).toEqual(0);

    const allOutput = capturedText.join('');

    expect(
      allOutput.includes(
        'Swagger object should not contain circular references.'
      )
    ).toEqual(true);

    expect(
      allOutput.includes('Definition was declared but never used in document')
    ).toEqual(true);
  });

  it('should correct an arbitrary object with cyclic paths', function() {
    const testObject = {};
    const nestedObject = {
      foo: {
        bar: testObject
      }
    };
    testObject.key = nestedObject;

    const paths = circularRefsValidator.correct(testObject);
    expect(paths[0].join('.')).toEqual('key.foo.bar');
  });

  it('should correctly convert a resolved path to a real one using refs', function() {
    const testObject = {
      first: {
        second: {
          $ref: '#/definitions/something'
        }
      },
      definitions: {
        something: {
          foo: {
            $ref: '#/definitions/something'
          }
        }
      }
    };

    const resolvedPaths = [['first', 'second', 'foo']];
    const realPath = circularRefsValidator.convert(testObject, resolvedPaths);
    expect(realPath[0]).toEqual('definitions.something.foo');
  });
});
