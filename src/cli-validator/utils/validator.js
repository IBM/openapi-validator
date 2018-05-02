const getVersion = require('./getOpenApiVersion');

// import the validators
const semanticValidators2 = require('require-all')(
  __dirname +
    '/../../plugins/validation/swagger2/semantic-validators/validators'
);

const semanticValidators3 = require('require-all')(
  __dirname + '/../../plugins/validation/oas3/semantic-validators/validators'
);

const structuralValidator = require(__dirname +
  '/../../plugins/validation/2and3/structural-validation/validator');

const sharedSemanticValidators = require('require-all')(
  __dirname + '/../../plugins/validation/2and3/semantic-validators/validators'
);

const circularRefsValidator = require('./circular-references-ibm');

const validators = {
  '2': {
    semanticValidators: semanticValidators2
  },
  '3': {
    semanticValidators: semanticValidators3
  }
};

// this function runs the validators on the swagger object
module.exports = function validateSwagger(allSpecs, config) {
  const version = getVersion(allSpecs.jsSpec);
  const { semanticValidators } = validators[version];
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
  const allValidators = [
    ...Object.keys(semanticValidators),
    ...Object.keys(sharedSemanticValidators)
  ];
  allValidators.forEach(key => {
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
