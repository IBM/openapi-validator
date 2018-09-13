module.exports = function(originalFile) {
  let processedFile;

  // replace all tabs characters (\t) in the original file with 2 spaces
  // for whatever reason, the `getLineNumberForPath` module will crash if
  // the swagger contains any tab characters
  const tabExpression = /\t/g;
  const twoSpaces = '  ';
  processedFile = originalFile.replace(tabExpression, twoSpaces);

  // replace all instances of an escapted solidus (`\/`) with a solidus (`/`)
  // the `yaml-js` package crashes if there is an escaped solidus
  const escapedSolidusExpression = /\\\//g;
  const solidus = '/';
  processedFile = processedFile.replace(escapedSolidusExpression, solidus);

  return processedFile;
};
