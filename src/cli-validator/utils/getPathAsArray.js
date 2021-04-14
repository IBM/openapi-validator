module.exports = function(path) {
  return Array.isArray(path) ? path : path.split('.');
};
