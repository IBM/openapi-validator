let globalId = 0;

// assigns a unique id to each error
module.exports = function() {
  globalId += 1;
  return globalId;
};
