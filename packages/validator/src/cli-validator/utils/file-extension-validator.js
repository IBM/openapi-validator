const last = require('lodash/last');

const getExtension = filename => {
  return last(filename.split('.')).toLowerCase();
};

const validateExtension = (filename, supportedFileTypes) => {
  const fileExtension = getExtension(filename);
  const hasExtension = filename.includes('.');
  const goodExtension =
    hasExtension && supportedFileTypes.includes(fileExtension);

  return goodExtension;
};

module.exports.supportedFileExtension = validateExtension;
module.exports.getFileExtension = getExtension;
