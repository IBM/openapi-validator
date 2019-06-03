const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const commandLineValidator = require('../../../src/cli-validator/runValidator');

// for an explanation of the text interceptor,
// see the comments for the first test in expectedOutput.js

describe('cli tool - test option handling', function() {
  it('should color output by default @skip-ci', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(txt);
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      if (line !== '\n') {
        expect(line).not.toEqual(stripAnsiFrom(line));
      }
    });
  });

  it('should not color output when -n option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(txt);
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.no_colors = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line).toEqual(stripAnsiFrom(line));
    });
  });

  it('should not print validator source file by default', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line.includes('Validator')).toEqual(false);
    });
  });

  it('should print validator source file when -p option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.print_validator_modules = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    let validatorsPrinted = false;

    capturedText.forEach(function(line) {
      if (line.includes('Validator')) {
        validatorsPrinted = true;
      }
    });

    expect(validatorsPrinted).toEqual(true);
  });

  it('should print correct statistics report when -s option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.report_statistics = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    let statisticsReported = false;

    capturedText.forEach(function(line) {
      if (line.includes('statistics')) {
        statisticsReported = true;
      }
    });

    // .match(/\S+/g) returns an array of all non-whitespace strings
    //   example output would be [ '33%', ':', 'operationIds', 'must', 'be', 'unique' ]
    expect(statisticsReported).toEqual(true);

    const statsSection = capturedText.findIndex(x => x.includes('statistics'));

    // totals
    expect(capturedText[statsSection + 1].match(/\S+/g)[5]).toEqual('4');
    expect(capturedText[statsSection + 2].match(/\S+/g)[5]).toEqual('8');

    // errors
    expect(capturedText[statsSection + 4].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 4].match(/\S+/g)[1]).toEqual('(50%)');

    expect(capturedText[statsSection + 5].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 5].match(/\S+/g)[1]).toEqual('(25%)');

    expect(capturedText[statsSection + 6].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 6].match(/\S+/g)[1]).toEqual('(25%)');

    // warnings
    expect(capturedText[statsSection + 9].match(/\S+/g)[0]).toEqual('2');
    expect(capturedText[statsSection + 9].match(/\S+/g)[1]).toEqual('(25%)');

    expect(capturedText[statsSection + 10].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 10].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 11].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 11].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 12].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 12].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 13].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 13].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 14].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 14].match(/\S+/g)[1]).toEqual('(13%)');

    expect(capturedText[statsSection + 15].match(/\S+/g)[0]).toEqual('1');
    expect(capturedText[statsSection + 15].match(/\S+/g)[1]).toEqual('(13%)');
  });

  it('should not print statistics report by default', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    capturedText.forEach(function(line) {
      expect(line.includes('statistics')).toEqual(false);
    });
  });

  it('should print json output when -j option is given', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/errAndWarn.yaml'];
    program.json = true;
    program.default_mode = true;

    await commandLineValidator(program);
    unhookIntercept();

    // capturedText should be JSON object. convert to json and check fields
    const outputObject = JSON.parse(capturedText);

    //console.print(JSON.stringify(outputObject)); //FIXME

    expect(outputObject.warning).toEqual(true);
    expect(outputObject.error).toEqual(true);

    // {"line": 59, "message": "operationIds must be unique", "path": "paths./pet.put.operationId"
    expect(outputObject['errors']['operation-ids'][0]['line']).toEqual(59);
    expect(outputObject['errors']['operation-ids'][0]['message']).toEqual(
      'operationIds must be unique'
    );

    // {"operations-shared": [{"line": 36, "message": "Operations must have a non-empty `operationId`.", "path": "paths./pet.post.operationId"},
    expect(outputObject['warnings']['operations-shared'][0]['line']).toEqual(
      36
    );
    expect(outputObject['warnings']['operations-shared'][0]['message']).toEqual(
      'Operations must have a non-empty `operationId`.'
    );
  });
  /*
  $ lint-openapi -c ./justWarnConfigOverride.json justWarn.yml

errors

  Message :   Schema must have a non-empty description.
  Path    :   definitions.Category
  Line    :   137

  Message :   Schema must have a non-empty description.
  Path    :   definitions.Tag
  Line    :   149

  Message :   Schema must have a non-empty description.
  Path    :   definitions.Pet
  Line    :   161

warnings

  Message :   Response schemas should be defined with a named ref.
  Path    :   paths./pet/
   */
  it('should change output for overridden options when config file is manually specified', async function() {
    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const program = {};
    program.args = ['./test/cli-validator/mockFiles/justWarn.yml'];
    program.config ='./test/cli-validator/mockFiles/justWarnConfigOverrideFull.json';

    const exitCode = await commandLineValidator(program);
    unhookIntercept();

    expect(exitCode).toEqual(1);

    // simple state machine to count the number of warnings and errors.
    let errorCount = 0;
    let warningCount = 0;
    let inErrorBlock = false;
    let inWarningBlock = false;

    capturedText.forEach(function(line) {
      if (line.includes('errors')) {
        inErrorBlock = true;
        inWarningBlock = false;
      } else if (line.includes('warnings')) {
        inErrorBlock = false;
        inWarningBlock = true;
      } else if (line.includes('Message')) {
        if (inErrorBlock) {
          errorCount++;
        } else if (inWarningBlock) {
          warningCount++;
        }
      }
    });
    expect(warningCount).toEqual(1);  // without the config this value is 5
    expect(errorCount).toEqual(3);    // without the config this value is 0
  });
});
