module.exports = function(originalFile) {
  let processedFile;

  // replace all tabs characters (\t) in the original file with 2 spaces
  // for whatever reason, the `getLineNumberForPath` module will crash if
  // the swagger contains any tab characters
  const tabExpression = /\t/g;
  const twoSpaces = '  ';
  processedFile = originalFile.replace(tabExpression, twoSpaces);

  // sanitize all instances of a solidus preceded by 1 or more escape characters
  // the `yaml-js` package crashes if there is an escaped solidus
  const escapedSolidus = /\\+\//g;
  const solidus = '/';
  processedFile = processedFile.replace(escapedSolidus, solidus);

  // Another problematic character is #9d - replace with space
  processedFile = processedFile.replace(/\x9d/g, ' ');

  return processedFile;
};
