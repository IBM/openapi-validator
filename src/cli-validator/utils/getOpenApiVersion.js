function getVersion(spec) {
  return spec.openapi ? '3' : '2';
}

module.exports = getVersion;
