/**
 * Returns true if and only if "mimeType" is a form-related mime type
 * (e.g. "multipart/form-data; charset=utf-8").
 * @param {string} mimeType the mimeType string
 * @returns true if "mimeType" indicates form content
 */
function isFormMimeType(mimeType) {
  if (!mimeType) {
    return false;
  }

  // Form-related mimetype regex's.
  const formMimeTypeREs = [
    /^multipart\/form-data(;.*)*$/,
    /^multipart\/related(;.*)*$/,
    /^multipart\/mixed(;.*)*$/,
    /^application\/x-www-form-urlencoded(;.*)*$/
  ];

  return !!formMimeTypeREs.find(re => mimeType.match(re));
}

module.exports = isFormMimeType;
