// import the validators
const semanticValidators = require('require-all')(
  __dirname + '/../../plugins/validation/semantic-validators/validators'
);
const structuralValidator = require(
  __dirname + '/../../plugins/validation/structural-validation/validator'
);
const circularRefsValidator = require('./circular-references-ibm');

// this function runs the validators on the swagger object
module.exports = function validateSwagger(allSpecs, config) {
  
  const validationResults = {
    errors: {},
    warnings: {},
    error: false,
    warning: false
  };

  // run circular reference validator
  if (allSpecs.circular) {
    const problem = circularRefsValidator.validate(allSpecs, config);
    const key = 'circular-references-ibm';
    if (problem.errors.length) {
      validationResults.errors[key] = [...problem.errors];
      validationResults.error = true;
    }
    if (problem.warnings.length) {
      validationResults.warnings[key] = [...problem.warnings];
      validationResults.warning = true;
    }
  }

  // run semantic validators
  Object.keys(semanticValidators).forEach(key => {
    const problem = semanticValidators[key].validate(allSpecs, config);
    if (problem.errors.length) {
      validationResults.errors[key] = [...problem.errors];
      validationResults.error = true;
    }
    if (problem.warnings.length) {
      validationResults.warnings[key] = [...problem.warnings];
      validationResults.warning = true;
    }
  });

  // run structural validator
  // all structural problems are errors  
  const structuralResults = structuralValidator.validate(allSpecs);
  const structuralKeys = Object.keys(structuralResults);

  if (structuralKeys.length) {
    validationResults.error = true;
    validationResults.errors['structural-validator'] = structuralKeys.map(key => {
      return {
        message: `Schema error: ${structuralResults[key].message}`,
        path: structuralResults[key].path
      };
    });
  }
 
  return validationResults;
}