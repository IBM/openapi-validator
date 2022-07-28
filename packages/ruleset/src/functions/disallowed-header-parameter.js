/**
 * This custom rule function is used to check for disallowed header parameters,
 * such as Authorization, Accept, or Content-Type.
 * When configuring a rule to use this function, the 'then.functionOptions'
 * rule property must be an object containing the 'headerName' property, like this:
 * { headerName: 'Authorization' }
 *
 * The function will flag 'param' if it is a header parameter named '<headerParam>'.
 * @param {*} param a parameter object from the API definition
 * @param {*} path the path location (array of path segments) of the
 * parameter object within the API definition
 * @param {*} headerName the name of the header parameter to check for
 * @returns an array of size one if 'param' is flagged, or an empty array otherwise
 */
module.exports = function(param, options, { path }) {
  if (!options || !options.headerName || !options.headerName.trim().length) {
    throw new Error(
      "Required rule configuration property 'headerName' not found."
    );
  }
  return checkHeaderParam(param, path, options.headerName.trim().toLowerCase());
};

// Return an error if 'param' is a header parameter named '<headerName>'.

function checkHeaderParam(param, path, headerName) {
  // Don't bother enforcing the rule on parameter references.
  if (!param.$ref) {
    const isHeader = param.in && param.in.toLowerCase() === 'header';
    const isDisallowedHeader =
      param.name && param.name.trim().toLowerCase() === headerName;
    if (isHeader && isDisallowedHeader) {
      return [
        {
          // This is a default message. We expect the rule definition to supply a message.
          message: `Header parameter "${headerName}" should not be explicitly defined.`,
          path
        }
      ];
    }
  }

  return [];
}
