/**
 * Returns true if and only if "mimeType" is a "JSON-like" mime type
 * (e.g. "application/json; charset=utf-8").
 * @param {string} mimeType the mimeType string
 * @returns true if "mimeType" represents a JSON media type
 */
function isJsonMimeType(mimeType) {
  if (!mimeType) {
    return false;
  }

  // application/json; charset=utf-8
  if (mimeType.match(/^application\/json(;.*)*$/)) {
    return true;
  }

  return false;
}

module.exports = isJsonMimeType;
