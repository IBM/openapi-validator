module.exports = function(param, _opts, { path }) {
  return parameterDescription(param, path);
};

function parameterDescription(param, path) {
  if (!shouldSkip(param) && !paramHasDescription(param)) {
    return [
      {
        message: 'Parameter should have a non-empty description',
        path
      }
    ];
  }

  return [];
}

function paramHasDescription(param) {
  return param.description && param.description.toString().trim().length;
}

function shouldSkip(param) {
  return param['x-sdk-exclude'] === true;
}
