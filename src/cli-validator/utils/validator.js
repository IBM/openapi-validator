const merge = require('deepmerge');
const getVersion = require('./getOpenApiVersion');

// import the validators
const semanticValidators2 = require('require-all')(
  __dirname + '/../../plugins/validation/swagger2/semantic-validators'
);

const semanticValidators3 = require('require-all')(
  __dirname + '/../../plugins/validation/oas3/semantic-validators'
);

const structuralValidator = require(__dirname +
  '/../../plugins/validation/2and3/structural-validation/validator');

const sharedSemanticValidators = require('require-all')(
  __dirname + '/../../plugins/validation/2and3/semantic-validators'
);

const circularRefsValidator = require('./circular-references-ibm');

const spectralValidator = require('../../spectral/utils/spectral-validator');

const validators = {
  '2': {
    semanticValidators: semanticValidators2
  },
  '3': {
    semanticValidators: semanticValidators3
  }
};

// this function runs the validators on the swagger object
module.exports = function validateSwagger(
  allSpecs,
  config,
  spectralResults,
  debug
) {
  const version = getVersion(allSpecs.jsSpec);
  allSpecs.isOAS3 = version === '3';
  const { semanticValidators } = validators[version];
  const validationResults = {
    errors: {},
    warnings: {},
    infos: {},
    hints: {},
    error: false,
    warning: false,
    info: false,
    hint: false
  };

  // use version specific and shared validations
  // they need to be at the top level of the config object
  const configSpecToUse = allSpecs.isOAS3 ? 'oas3' : 'swagger2';
  config = merge(config.shared, config[configSpecToUse]);

  // merge the spectral results
  const parsedSpectralResults = spectralValidator.parseResults(
    spectralResults,
    debug
  );
  const key = 'spectral';
  if (parsedSpectralResults.errors.length) {
    validationResults.errors[key] = [...parsedSpectralResults.errors];
    validationResults.error = true;
  }
  if (parsedSpectralResults.warnings.length) {
    validationResults.warnings[key] = [...parsedSpectralResults.warnings];
    validationResults.warning = true;
  }
  if (parsedSpectralResults.infos.length) {
    validationResults.infos[key] = [...parsedSpectralResults.infos];
    validationResults.info = true;
  }
  if (parsedSpectralResults.hints.length) {
    validationResults.hints[key] = [...parsedSpectralResults.hints];
    validationResults.hint = true;
  }

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
    if (problem.infos.length) {
      validationResults.infos[key] = [...problem.infos];
      validationResults.info = true;
    }
    if (problem.hints.length) {
      validationResults.hints[key] = [...problem.hints];
      validationResults.hint = true;
    }
  });

  Object.keys(sharedSemanticValidators).forEach(key => {
    const problem = sharedSemanticValidators[key].validate(allSpecs, config);
    if (problem.errors.length) {
      validationResults.errors[key] = [].concat(
        validationResults.errors[key] || [],
        problem.errors
      );
      validationResults.error = true;
    }
    if (problem.warnings.length) {
      validationResults.warnings[key] = [].concat(
        validationResults.warnings[key] || [],
        problem.warnings
      );
      validationResults.warning = true;
    }
    if (problem.infos.length) {
      validationResults.infos[key] = [].concat(
        validationResults.infos[key] || [],
        problem.infos
      );
      validationResults.info = true;
    }
    if (problem.hints.length) {
      validationResults.hints[key] = [].concat(
        validationResults.hints[key] || [],
        problem.hints
      );
      validationResults.hint = true;
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
