// Assertation 1:
// check if info exists

// Assertation 2:
// making sure that the required version and title are defined properly
module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  const info = jsSpec.info;
  const hasInfo = info && typeof info === 'object';
  if (!hasInfo) {
    errors.push({
      path: ['info'],
      message: 'API definition must have an `info` object'
    });
  } else {
    const title = jsSpec.info.title;
    const hasTitle =
      typeof title === 'string' && title.toString().trim().length > 0;
    const version = jsSpec.info.version;
    const hasVersion =
      typeof version === 'string' && version.toString().trim().length > 0;

    if (!hasTitle) {
      errors.push({
        path: ['info', 'title'],
        message: '`info` object must have a string-type `title` field'
      });
    } else if (!hasVersion) {
      errors.push({
        path: ['info', 'version'],
        message: '`info` object must have a string-type `version` field'
      });
    }
  }
  return { errors, warnings };
};
