// import the validators
const semanticValidators = require('require-all')(__dirname + '/../../plugins/validation/semantic-validators/validators');
const structuralValidator = require(__dirname + '/../../plugins/validation/structural-validation/validator');

// this function runs the validators on the swagger object
module.exports = function validateSwagger(allSpecs, config) {
  
  const validationResults = { errors: {}, warnings: {}, cleanSwagger: true };

  // run semantic validators
  Object.keys(semanticValidators).forEach(key => {
    const problem = semanticValidators[key].validate(allSpecs, config);
    if (problem.errors.length) {
      validationResults.errors[key] = [...problem.errors];
      validationResults.cleanSwagger = false;
    }
    if (problem.warnings.length) {
      validationResults.warnings[key] = [...problem.warnings];
      validationResults.cleanSwagger = false;
    }
  });

  // run structural validator
  // all structural problems are errors  
  const structuralResults = structuralValidator.validate(allSpecs);
  const structuralKeys = Object.keys(structuralResults);

  if (structuralKeys.length) {
    validationResults.errors['structural-validator'] = [];
    validationResults.cleanSwagger = false;
    structuralKeys.forEach(key => {
      const message = `Schema error: ${structuralResults[key].message}`;
      const path = structuralResults[key].path;
      validationResults.errors['structural-validator'].push({message, path});
    });
  }
 
  return validationResults;
}