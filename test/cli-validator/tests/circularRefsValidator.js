require("babel-polyfill");

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../dist/src/cli-validator/runValidator');
const circularRefsValidator = require('../../../dist/src/cli-validator/utils/circular-references-ibm');

describe('cli tool - test expected output', function() {

  it ('should correctly validate a file with circular references', async function() {

    let captured_text = [];

    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let program = {};
    program.args = ['./test/cli-validator/mockFiles/circularRefs.yml'];
    program.default_mode = true;

    const exitCode = await commandLineValidator(program);

    unhook_intercept();

    expect(exitCode).toEqual(0);

    const allOutput = captured_text.join('');

    expect(allOutput.includes('Swagger object must not contain circular references.')).toEqual(true);
    expect(allOutput.includes('Definition was declared but never used in document')).toEqual(true);
  });

  it ('should correct an arbitrary object with cyclic paths', function() {
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

  it ('should correctly convert a resolved path to a real one using refs', function() {
    const testObject = {
      first: {
        second: {
          '$ref': '#/definitions/something'
        }
      },
      definitions: {
        something: {
          foo: {
            '$ref': '#/definitions/something'
          }
        }
      }
    };

    const resolvedPaths = [['first', 'second', 'foo']];
    const realPath = circularRefsValidator.convert(testObject, resolvedPaths);
    expect(realPath[0]).toEqual('definitions.something.foo');
  });
});
