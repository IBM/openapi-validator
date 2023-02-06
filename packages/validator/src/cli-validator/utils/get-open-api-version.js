function getVersion(spec) {
  // Let's prefer "openapi 3.x" if no swagger field is found.
  return spec.swagger ? '2' : '3';
}

module.exports = getVersion;
