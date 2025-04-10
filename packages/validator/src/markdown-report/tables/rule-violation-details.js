/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { parseViolationMessage } = require('../../cli-validator/utils');

const MarkdownTable = require('../markdown-table');

function getTables(violations) {
  // Stores the header and the table for each rule.
  const ruleReports = {};

  for (const severity of ['error', 'warning']) {
    for (const { message, path, rule, line } of violations[severity].results) {
      const [generalizedMessage, details] = parseViolationMessage(message);

      // Add a new entry for this rule.
      if (!ruleReports[rule]) {
        ruleReports[rule] = {
          header: createHeader(rule, severity, generalizedMessage),
        };

        // Add an extra column if the rule includes details in the message.
        if (details) {
          ruleReports[rule].table = new MarkdownTable(
            'Line',
            'Path',
            'Details'
          );
        } else {
          ruleReports[rule].table = new MarkdownTable('Line', 'Path');
        }
      }

      // Add additional rows to the table for the rule.
      if (details) {
        ruleReports[rule].table.addRow(line, path.join('.'), details);
      } else {
        ruleReports[rule].table.addRow(line, path.join('.'));
      }
    }
  }

  let tableOutput = '';
  for (const { header, table } of Object.values(ruleReports)) {
    tableOutput += `${header}${table.render()}\n\n`;
  }

  // Remove the final newline characters from the string.
  return tableOutput.trim();
}

module.exports = getTables;

function createHeader(ruleName, severity, generalizedMessage) {
  const severityColors = {
    error: '🔴',
    warning: '🟠',
  };

  // Template string for header.
  return `### ${severityColors[severity]} ${ruleName}

_${generalizedMessage}_

`;
}
