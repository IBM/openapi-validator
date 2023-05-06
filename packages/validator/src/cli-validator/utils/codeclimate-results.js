/**
 * Copyright 2023 IBM Corporation, Matthias Blümel.
 * SPDX-License-Identifier: Apache2.0
 */

const each = require('lodash/each');

function printCCJson(validFile, results) {
  const types = ['error', 'warning', 'info', 'hint'];
  const ccTypeMap = {
    error: 'critical',
    warning: 'major',
    info: 'minor',
    hint: 'info',
  };

  types.forEach(type => {
    each(results[type].results, result => {
      let content;
      if (result.path.length !== 0) {
        let markdown = '';
        each(result.path, pathItem => {
          markdown += '* ' + pathItem + '\n';
        });
        content = { body: markdown };
      }
      const ccResult = {
        type: 'issue',
        check_name: result.rule,
        description: result.message,
        content: content,
        categories: ['Style'], // required by codeclimate, ignored by gitlab; has to be defined by the rule.
        location: {
          path: validFile,
          lines: {
            begin: result.line,
            end: result.line,
          },
        },
        severity: ccTypeMap[type],
      };
      console.log(JSON.stringify(ccResult) + '\0\n');
    });
  });
}

module.exports.printCCJson = printCCJson;
