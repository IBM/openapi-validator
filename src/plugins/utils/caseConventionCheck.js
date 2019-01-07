/*
  Snake Case: A custom RegEx in implemented here so that number characters are allowed to
  directly follow letter characters, without an underscore in between. The
  snakecase module in lodash (which was previously used) did not allow this
  behavior. This is especially important in API paths e.g. '/api/v1/path'

*/
const lowerSnakeCase = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const upperCamelCase = /^[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*$/;
const lowerCamelCase = /^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$/;
const lowerDashCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

module.exports = (string, convention) => {
  switch (convention) {
    case 'lower_snake_case':
      return lowerSnakeCase.test(string);

    case 'upper_camel_case':
      return upperCamelCase.test(string);

    case 'lower_camel_case':
      return lowerCamelCase.test(string);

    case 'lower_dash_case':
      return lowerDashCase.test(string);

    default:
      // this should never happen, the convention is validated in the config processor
      console.log(`Unsupported case: ${convention}`);
  }
};
