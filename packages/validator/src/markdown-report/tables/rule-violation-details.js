/**
 * Copyright 2026 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../markdown-table');
const { splitMessage } = require('../../spectral/utils');

function groupResultsByRule(results) {
  const groupedByRule = {};

  results.forEach(result => {
    const { base, detail } = splitMessage(result.message);

    if (!groupedByRule[result.rule]) {
      groupedByRule[result.rule] = {
        docLink: result.docLink,
        groups: [],
      };
    }

    const ruleEntry = groupedByRule[result.rule];
    let group = ruleEntry.groups.find(g => g.base === base);
    if (!group) {
      group = { base, violations: [] };
      ruleEntry.groups.push(group);
    }

    // Every result is listed, so the rows always match the summary counts.
    group.violations.push({
      line: result.line,
      path: result.path.join('.'),
      detail,
    });
  });

  return groupedByRule;
}

function renderRuleGroups(groupedByRule) {
  const sections = [];

  Object.entries(groupedByRule).forEach(([rule, data]) => {
    // Create heading with link or plain text when missing
    sections.push(
      data.docLink ? `#### [${rule}](${data.docLink})` : `#### ${rule}`
    );
    sections.push('');

    data.groups.forEach(({ base, violations }) => {
      // Add the base message as italic description
      sections.push(`_${base}_`);
      sections.push('');

      // Use a 3-col table when any violation carries extra detail
      const hasDetail = violations.some(v => v.detail);
      const table = hasDetail
        ? new MarkdownTable('Line', 'Path', 'Detail')
        : new MarkdownTable('Line', 'Path');

      violations.forEach(({ line, path, detail }) => {
        if (hasDetail) {
          table.addRow(line, path, detail);
        } else {
          table.addRow(line, path);
        }
      });

      sections.push(table.render());
      sections.push('');
    });
  });

  return sections.join('\n');
}

function getTable({ error, warning }) {
  const sections = [];

  // Process errors
  if (error.results.length > 0) {
    sections.push('### Errors');
    sections.push('');
    const errorGroups = groupResultsByRule(error.results);
    sections.push(renderRuleGroups(errorGroups));
  }

  // Process warnings
  if (warning.results.length > 0) {
    sections.push('### Warnings');
    sections.push('');
    const warningGroups = groupResultsByRule(warning.results);
    sections.push(renderRuleGroups(warningGroups));
  }

  return sections.join('\n').trim();
}

module.exports = getTable;
