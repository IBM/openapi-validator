const each = require('lodash/each');
const pad = require('pad');

// get line-number-producing, 'magic' code from Swagger Editor
const getLineNumberForPath = require(__dirname + '/../../plugins/ast/ast')
  .getLineNumberForPath;

// this function prints all of the output
module.exports = function print(
  results,
  chalk,
  printValidators,
  printRuleNames,
  reportingStats,
  originalFile,
  errorsOnly
) {
  const types = errorsOnly
    ? ['errors']
    : ['errors', 'warnings', 'infos', 'hints'];
  const colors = {
    errors: 'bgRed',
    warnings: 'bgYellow',
    infos: 'bgGrey',
    hints: 'bgGreen'
  };

  // define an object template in the case that statistics reporting is turned on
  const stats = {
    errors: {
      total: 0
    },
    warnings: {
      total: 0
    },
    infos: {
      total: 0
    },
    hints: {
      total: 0
    }
  };

  console.log();

  types.forEach(type => {
    let color = colors[type];
    if (Object.keys(results[type]).length) {
      console.log(chalk[color].bold(`${type}\n`));
    }

    // convert 'color' from a background color to foreground color
    color = color.slice(2).toLowerCase(); // i.e. 'bgRed' -> 'red'

    each(results[type], (problems, validator) => {
      if (printValidators) {
        console.log(`Validator: ${validator}`);
      }

      problems.forEach(problem => {
        // To allow messages with fillins to be grouped properly in the statistics,
        // truncate the message at the first ':'
        const message = problem.message.split(':')[0];
        let path = problem.path;

        // collect info for stats reporting, if applicable

        stats[type].total += 1;

        if (!stats[type][message]) {
          stats[type][message] = 0;
        }

        stats[type][message] += 1;

        // path needs to be an array to get the line number
        if (!Array.isArray(path)) {
          path = path.split('.');
        }

        // get line number from the path of strings to the problem
        // as they say in src/plugins/validation/semantic-validators/hook.js,
        //
        //                  "it's magic!"
        //
        const lineNumber = getLineNumberForPath(originalFile, path);

        // print the path array as a dot-separated string

        console.log(chalk[color](`  Message :   ${problem.message}`));
        if (printRuleNames) {
          console.log(chalk[color](`  Rule    :   ${problem.rule}`));
        }
        console.log(chalk[color](`  Path    :   ${path.join('.')}`));
        console.log(chalk[color](`  Line    :   ${lineNumber}`));
        console.log();
      });
    });
  });

  // print the stats here, if applicable
  if (
    reportingStats &&
    (stats.errors.total ||
      stats.warnings.total ||
      stats.infos.total ||
      stats.hints.total)
  ) {
    console.log(chalk.bgCyan('statistics\n'));

    console.log(
      chalk.cyan(`  Total number of errors   : ${stats.errors.total}`)
    );
    console.log(
      chalk.cyan(`  Total number of warnings : ${stats.warnings.total}`)
    );
    if (stats.infos.total > 0) {
      console.log(
        chalk.cyan(`  Total number of infos    : ${stats.infos.total}`)
      );
    }
    if (stats.hints.total > 0) {
      console.log(
        chalk.cyan(`  Total number of hints    : ${stats.hints.total}`)
      );
    }
    console.log('');

    types.forEach(type => {
      // print the type, either error or warning
      if (stats[type].total) {
        console.log('  ' + chalk.underline.cyan(type));
      }

      Object.keys(stats[type]).forEach(message => {
        if (message !== 'total') {
          // calculate percentage
          const number = stats[type][message];
          const total = stats[type].total;
          const percentage = Math.round((number / total) * 100).toString();

          // pad(<number>, <string>) right-aligns <string> to the <number>th column, padding with spaces.
          // use 4, two for the appended spaces of every line and two for the number
          //   (assuming errors/warnings won't go to triple digits)
          const numberString = pad(4, number.toString());
          // use 6 for largest case of '(100%)'
          const frequencyString = pad(6, `(${percentage}%)`);

          console.log(
            chalk.cyan(`${numberString} ${frequencyString} : ${message}`)
          );
        }
      });
      if (stats[type].total) {
        console.log();
      }
    });
  }
};
