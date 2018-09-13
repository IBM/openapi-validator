/*
  A custom RegEx in implemented here so that number characters are allowed to
  directly follow letter characters, without an underscore in between. The
  snakecase module in lodash (which was previously used) did not allow this
  behavior. This is especially important in API paths e.g. '/api/v1/path'

*/
const snakeCaseRegex = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
module.exports = string => snakeCaseRegex.test(string);
