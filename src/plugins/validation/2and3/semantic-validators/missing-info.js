// Assertation 1:
// check if info exists

// Assertation 2:
// making sure that the required version and title are defined properly

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  if (!jsSpec.info) {
    errors.push({
      path: ['info'],
      message: 'Missing info object for api defintion'
    });
  }
  //Assertion 2
  if (
    jsSpec.info &&
    (jsSpec.info.title != 'string' || typeof jsSpec.info.version != 'string')
  ) {
    errors.push({
      path: ['info', 'title'],
      message:
        'Info object missing proper definitions for title or version properties'
    });
  }
  return { errors };
};
