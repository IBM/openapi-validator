// Assertation 1:
// check if info exists

// Assertation 2:
// making sure that the required version and title are defined properly
module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];
  const info = jsSpec.info;
  if (!info) {
    errors.push({
      path: ['info'],
      message: 'Missing info object for api defintion'
    });
  } else if (typeof info != 'object') {
    errors.push({
      path: ['info'],
      message: 'Info is an obect and must have properties'
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
        message: ' Info object is missng the title field'
      });
    } else if (!hasVersion) {
      errors.push({
        path: ['info', 'version'],
        message: ' Info object is missng the version field'
      });
    }
  }
  return { errors, warnings };
};
