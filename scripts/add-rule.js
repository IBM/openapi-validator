#!/usr/bin/env node

const fs = require('fs');
const { confirm, input } = require('@inquirer/prompts');

async function prompt() {
  console.log(emitNamingRules());

  const name = await input({
    message: 'Enter a name for the new rule',
    validate: name => {
      if (!name.startsWith('ibm-')) {
        return 'Names must start with "ibm-"';
      } else if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
        return 'Names must be in "lower-kebab-case"';
      }

      return true;
    },
  });
  const camelCaseName = name
    .slice(4)
    .replace(/-[a-z]/g, m => m.slice(1).toUpperCase());
  const hasCustomFunction = await confirm({
    message: 'Do you need a custom function?',
  });

  if (hasCustomFunction) {
    const customFunctionPath = `${__dirname}/../packages/ruleset/src/functions/${name.slice(4)}.js`;
    fs.writeFileSync(customFunctionPath, emitCustomFunction(camelCaseName));

    addToIndex(
      `${__dirname}/../packages/ruleset/src/functions/index.js`,
      `${camelCaseName}: require('./${name.slice(4)}')`
    );
  }

  const rulePath = `${__dirname}/../packages/ruleset/src/rules/${name.slice(4)}.js`;
  fs.writeFileSync(rulePath, emitRule(camelCaseName, hasCustomFunction));

  addToIndex(
    `${__dirname}/../packages/ruleset/src/rules/index.js`,
    `${camelCaseName}: require('./${name.slice(4)}')`
  );

  addToIndex(
    `${__dirname}/../packages/ruleset/src/ibm-oas.js`,
    `'${name}': ibmRules.${camelCaseName}`
  );
}

function emitRule(name, hasCustomFunction) {
  return `/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { oas3 } = require('@stoplight/spectral-formats');
const {
  // See docs/openapi-ruleset-utilities.md
  operations,
  // parameters,
  // patchOperations,
  // paths,
  // requestBodySchemas,
  // responseSchemas,
  // schemas,
  // securitySchemes,
  // unresolvedRequestBodySchemas,
  // unresolvedResponseSchemas,
  // unresolvedSchemas,
} = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
${hasCustomFunction ? `const { ${name} } = require('../functions');` : emitCoreFunctionsImport()}

module.exports = {
  description: 'X should be Y',
  message: '{{error}}',
  severity: 'error',
  formats: [oas3],
  resolved: true,
  given: operations /* see other options above */,
  then: {
    function: ${hasCustomFunction ? name : 'truthy /* see other options above */'},
  },
};
`;
}

function emitCustomFunction(name) {
  return `/**
 * Copyright 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  // See docs/openapi-ruleset-utilities.md
  // collectFromComposedSchemas,
  // getExamplesForSchema,
  // getPropertyNamesForSchema,
  // getSchemaType,
  // isArraySchema,
  // isBinarySchema,
  // isBooleanSchema,
  // isByteSchema,
  // isDateSchema,
  // isDateTimeSchema,
  // isDoubleSchema,
  // isEnumerationSchema,
  // isFloatSchema,
  // isInt32Schema,
  // isInt64Schema,
  // isIntegerSchema,
  // isNumberSchema,
  isObject,
  // isObjectSchema,
  // isPrimitiveSchema,
  // isStringSchema,
  // schemaHasConstraint,
  // schemaHasProperty,
  // schemaIsOfType,
  // schemaLooselyHasConstraint,
  // schemaRequiresProperty,
  // SchemaType,
  // validateComposedSchemas,
  // validateNestedSchemas,
  // validateSubschemas,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  // sometimes you'll instead want validateComposedSchemas(), validateNestedSchemas(),
  // or validateSubschemas() called here with ${name}() as a validate callback
  return ${name}(schema, context.path);
};

function ${name}(schema, path) {
  const errors = [];

  // use throughout as needed
  if (!isObject(schema)) {
    logger.debug(\`\${ruleId}: some potential runtime problem identified\`);
  }

  if (schema.x !== 'y') {
    errors.push({
      message: 'X must be Y',
      path,
    });
  }

  return errors;
}
`;
}

function emitCoreFunctionsImport() {
  return `const {
  // See https://docs.stoplight.io/docs/spectral/cb95cf0d26b83-core-functions
  //
  // alphabetical,
  // enumeration,
  // falsy,
  // length,
  // pattern,
  // casing,
  // schema,
  // truthy,
  // defined,
  // "undefined" as notDefined,
  // unreferencedReusableObject,
  // or,
  // xor,
  // typedEnum,
} = require('@stoplight/spectral-functions');
`;
}

function emitNamingRules() {
  return `Rule names must:
* Start with "ibm-"
* Be in "lower-kebab-case"
* Not be named for invalid behavior

Examples:
\x1b[32m✔\x1b[0m ibm-consistent-schema-type
  \x1b[31m✘\x1b[0m consistent-schema-type
\x1b[32m✔\x1b[0m ibm-anchored-patterns
  \x1b[31m✘\x1b[0m ibmAnchoredPatterns
\x1b[32m✔\x1b[0m ibm-integer-attributes
  \x1b[31m✘\x1b[0m ibm-missing-integer-attributes
\x1b[32m✔\x1b[0m ibm-integer-attributes
  \x1b[31m✘\x1b[0m ibm-missing-integer-attributes
\x1b[32m✔\x1b[0m ibm-no-property-name-collisions
  \x1b[31m✘\x1b[0m ibm-property-name-collision
`;
}

function addToIndex(indexPath, line) {
  const index = fs.readFileSync(indexPath, 'utf8');

  const { prefix, linePrefix, list, suffix } = index.match(
    /^(?<prefix>(.|\n)*\/\/ -- START INDEX --)(?<list>(?<linePrefix>\s*)(.|\n)*[^\s,])(?<suffix>[\s*,]*\/\/ -- END INDEX --(.|\n)*)$/
  ).groups;

  if (list.indexOf(line) === -1) {
    const newList = [...list.split(','), `${linePrefix}${line}`]
      .sort()
      .join(',');

    fs.writeFileSync(indexPath, `${prefix}${newList}${suffix}`);
  }
}

prompt();
