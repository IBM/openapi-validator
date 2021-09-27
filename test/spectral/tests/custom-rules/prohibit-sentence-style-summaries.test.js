const inCodeValidator = require('../../../../src/lib');

describe('spectral - summaries do not have trailing period', () => {
  it('should not display error when summary does not have trailing period', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Summary does not have trailing comma'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'No trailing period here'
          }
        }
      }
    };

    const result = await inCodeValidator(spec, true);
    const relevantError = result.warnings.find(
      v => v.rule === 'prohibit-summary-sentence-style'
    );
    expect(relevantError).toBeUndefined();
  });

  it('should display error when a summary has trailing period', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Summary has trailing period'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'There is a trailing period here.'
          }
        }
      }
    };

    const validationResult = await inCodeValidator(spec, true);
    expect(validationResult.errors).not.toBeUndefined();
    const errors = validationResult.warnings.filter(
      v => v.rule === 'prohibit-summary-sentence-style'
    );
    expect(errors).not.toBeUndefined();
    expect(errors.length).toBe(1);
    expect(errors[0].path).toEqual([
      'paths',
      'createTrailingPeriod',
      'post',
      'summary'
    ]);
  });

  it('should display errors when multiple summaries have trailing periods', async () => {
    const spec = {
      openapi: '3.0.0.',
      info: {
        version: '1.0.0.',
        title: 'Summary has trailing period'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'Adds trailing period.'
          }
        },
        createUser: {
          post: {
            operationId: 'createUser',
            description: 'Creates a new user',
            summary: 'Creates a new user.'
          }
        }
      }
    };

    const validationResult = await inCodeValidator(spec, true);
    expect(validationResult.errors).not.toBeUndefined();
    const errors = validationResult.warnings.filter(
      v => v.rule === 'prohibit-summary-sentence-style'
    );
    expect(errors.length).toBe(2);

    expect(errors[0].path).toEqual([
      'paths',
      'createTrailingPeriod',
      'post',
      'summary'
    ]);
    expect(errors[1].path).toEqual(['paths', 'createUser', 'post', 'summary']);
  });
});
