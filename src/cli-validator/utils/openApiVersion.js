// Determine the version of the OpenAPI spec to validate against
// Defaults to OpenAPI 2.0

module.exports = version => {
  const defaultVersion = '2';
  const supportedVersions = ['2', '3'];
  return supportedVersions.includes(version) ? version : defaultVersion;
};
