// import the validators
const semanticValidators2 = require('require-all')(
  __dirname +
    '/../../plugins/validation/openApi2/semantic-validators/validators'
);

const structuralValidator2 = require(__dirname +
  '/../../plugins/validation/openApi2/structural-validation/validator');

const semanticValidators3 = require('require-all')(
  __dirname +
    '/../../plugins/validation/openApi3/semantic-validators/validators'
);

const structuralValidator3 = require(__dirname +
  '/../../plugins/validation/openApi3/structural-validation/validator');

const circularRefsValidator = require('./circular-references-ibm');

const validators = {
  '2': {
    semanticValidators: semanticValidators2,
    structuralValidator: structuralValidator2
  },
  '3': {
    semanticValidators: semanticValidators3,
    structuralValidator: structuralValidator3
  }
};

// this function runs the validators on the swagger object
module.exports = function validateSwagger(allSpecs, config, version) {
  const { semanticValidators, structuralValidator } = validators[version];
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
    validationResults.errors['structural-validator'] = structuralKeys.map(
      key => ({
        message: `Schema error: ${structuralResults[key].message}`,
        path: structuralResults[key].path
      })
    );
  }

  return validationResults;
};
