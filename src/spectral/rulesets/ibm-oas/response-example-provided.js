module.exports = function(response) {
  if (!responseLevelExamples(response) && !schemaLevelExample(response)) {
    return [
      {
        message: 'Response bodies should include an example response'
      }
    ];
  }
};

function responseLevelExamples(response) {
  return response.example || response.examples;
}

function schemaLevelExample(response) {
  return response.schema && response.schema.example;
}
