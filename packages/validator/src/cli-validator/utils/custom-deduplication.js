// this is the same as spectral's default deduplication function, except it
// takes the message into account. the default implementation does not,
// which leads it to ignore validations that come from the same rule (code)
// and path.

module.exports = function(rule, hash) {
  let id = String(rule.code);

  if (rule.path.length > 0) {
    id += JSON.stringify(rule.path);
  } else {
    id += JSON.stringify(rule.range);
  }

  if (rule.source !== void 0) {
    id += rule.source;
  }

  if (rule.message !== void 0) {
    id += rule.message;
  }

  return hash(id);
};
