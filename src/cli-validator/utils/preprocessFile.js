module.exports = function(originalFile) {
  let processedFile;

  // replace all tabs characters (\t) in the original file with 2 spaces
  // for whatever reason, the `getLineNumberForPath` module will crash if
  // the swagger contains any tab characters
  const tabExpression = /\t/g;
  const twoSpaces = '  ';
  processedFile = originalFile.replace(tabExpression, twoSpaces);

  const escapedSolidus = /\\\//g;

  // replace all instances of a double escaped solidus (`\\/`) with a single escaped solidus `\/`
  const doubleEscapedSolidus = /\\\\\//g;
  processedFile = processedFile.replace(doubleEscapedSolidus, escapedSolidus);

  // replace all instances of an escaped solidus (`\/`) with a solidus (`/`)
  // the `yaml-js` package crashes if there is an escaped solidus
  const solidus = '/';
  processedFile = processedFile.replace(escapedSolidus, solidus);

  return processedFile;
};
