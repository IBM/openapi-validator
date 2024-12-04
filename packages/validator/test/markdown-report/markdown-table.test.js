/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const MarkdownTable = require('../../src/markdown-report/markdown-table');

describe('MarkdownTable tests', function () {
  it('constructor creates new instance of MarkdownTable', function () {
    expect(new MarkdownTable()).toBeInstanceOf(MarkdownTable);
  });

  it('constructor accepts variable argument lengths', function () {
    expect(new MarkdownTable('one')).toBeInstanceOf(MarkdownTable);
    expect(new MarkdownTable('one', 'two')).toBeInstanceOf(MarkdownTable);
    expect(new MarkdownTable('one', 'two', 'three')).toBeInstanceOf(
      MarkdownTable
    );
    expect(
      new MarkdownTable('one', 'two', 'three', 'and so on')
    ).toBeInstanceOf(MarkdownTable);
  });

  it('addRow logs an error if it receives a bad number of arguments', function () {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const table = new MarkdownTable('exactly', 'two');

    table.addRow('one', 'too', 'many');
    table.addRow('one too few');

    const logs = consoleErrorSpy.mock.calls;
    expect(logs[0][0]).toBe(
      'Error: addRow expected 2 arguments but received 3'
    );
    expect(logs[1][0]).toBe(
      'Error: addRow expected 2 arguments but received 1'
    );

    consoleErrorSpy.mockRestore();
  });

  it('render returns a string representation of a markdown table based on added row data', function () {
    const table = new MarkdownTable('rule', 'violation count');

    table.addRow('ibm-api-symmetry', 10);
    // An undefined value can happen in certain scenarios.
    // It should end up as a blank cell.
    table.addRow('ibm-no-ambiguous-paths', undefined);
    table.addRow('ibm-pagination-style', 1);

    const renderedTable = table.render().split('\n');
    expect(renderedTable[0]).toBe('| rule | violation count |');
    expect(renderedTable[1]).toBe('| --- | --- |');
    expect(renderedTable[2]).toBe('| ibm-api-symmetry | 10 |');
    expect(renderedTable[3]).toBe('| ibm-no-ambiguous-paths |  |');
    expect(renderedTable[4]).toBe('| ibm-pagination-style | 1 |');
  });
});
