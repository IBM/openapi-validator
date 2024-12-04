/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

class MarkdownTable {
  #headerRow; // String, with the header row.
  #rows = []; // Array of strings, all rows of the table body.
  #length; // Integer, the number of columns.

  constructor(...columnHeaders) {
    this.#length = columnHeaders.length;
    this.#headerRow = this.#createTableRow(...columnHeaders);
  }

  addRow(...data) {
    if (data.length !== this.#length) {
      console.error(
        `Error: addRow expected ${this.#length} arguments but received ${
          data.length
        }`
      );
      return;
    }

    // Any "blank" cells will be represented as 'undefined' in the
    // row data at this point. Convert those values to empty strings.
    data = data.map(v => v || '');

    this.#rows.push(this.#createTableRow(...data));
  }

  render() {
    const table = [this.#headerRow];
    table.push(this.#getSeparatorRow(this.#length));
    table.push(...this.#rows);
    return table.join('\n');
  }

  #createTableRow(...data) {
    return `| ${data.join(' | ')} |`;
  }

  #getSeparatorRow(cols) {
    let row = '|';
    for (let i = 0; i < cols; i++) {
      row += ' --- |';
    }
    return row;
  }
}

module.exports = MarkdownTable;
