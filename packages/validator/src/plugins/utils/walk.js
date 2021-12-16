const walk = function(obj, path, validation) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  // don't walk down examples or extensions
  const current = path[path.length - 1];
  if (
    current === 'example' ||
    current === 'examples' ||
    (current && current.slice(0, 2) === 'x-')
  ) {
    return;
  }

  // run the validation code
  validation(obj, path);

  // recursively walk through the spec
  const childProperties = Object.keys(obj);
  if (childProperties.length) {
    return childProperties.map(key => {
      return walk(obj[key], [...path, key], validation);
    });
  } else {
    return null;
  }
};

module.exports = walk;
