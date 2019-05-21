// Assertation 1:
// check if info exists

// Assertation 2:
// making sure that the required version and title are defined properly
module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];
  const no_input = !jsSpec.info;
  let mistyped_title_or_version = false;
  if (no_input) {
    errors.push({
      path: ['info'],
      message: 'Missing info object for api defintion'
    });
  }
  //Assertion 2
  if (
    jsSpec.info &&
    (typeof jsSpec.info.title != 'string' ||
      typeof jsSpec.info.version != 'string')
  ) {
    mistyped_title_or_version = true;
  }
  if (mistyped_title_or_version) {
    errors.push({
      path: ['info', 'title'],
      message:
        'Info object missing proper definitions for title or version properties'
    });
  }
  return { errors: errors, warnings: warnings };
};
