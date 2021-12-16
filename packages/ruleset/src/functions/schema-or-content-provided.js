module.exports = function(obj) {
  if (!obj.schema && !obj.content) {
    return [
      {
        message: 'Parameter must provide either a schema or content'
      }
    ];
  }
};
