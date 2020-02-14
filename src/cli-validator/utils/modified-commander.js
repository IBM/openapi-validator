const program = require('commander');

// This module is used to modify the commander code. When
// an unsupported option is given, only a single-line error
// is printed. Now, it will also print out the usage menu.

// deletes the function in order to reimplement it
delete program['unknownOption'];

// reimplementing the funciton
program.unknownOption = function(flag) {
  if (this._allowUnknownOption) return;
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();

  // this is the extra code added to the function
  this.outputHelp();

  process.exit(1);
};

module.exports = program;
