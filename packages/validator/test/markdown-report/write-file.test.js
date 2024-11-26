/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { existsSync, readFileSync, unlinkSync } = require('fs');
const writeReportToFile = require('../../src/markdown-report/write-file');

describe('writeReportToFile tests', function () {
  const baseFilename = 'test-api-def-file';
  const expectedFilename = `${baseFilename}-validator-report.md`;

  // Clean up by deleting the file.
  afterEach(function () {
    unlinkSync(expectedFilename);
  });

  it('should write contents to a file and return its resolved path', function () {
    const mockReportContents = 'Not a very detailed report.';
    const mockContext = { currentFilename: `${baseFilename}.json` };

    // File should not exist before report is written.
    expect(existsSync(expectedFilename)).toBe(false);

    // Write the report.
    const resolvedPath = writeReportToFile(mockContext, mockReportContents);

    // Check for a successful write.
    expect(existsSync(expectedFilename)).toBe(true);
    expect(resolvedPath).toMatch(
      new RegExp(`.*/openapi-validator/packages/validator/${baseFilename}`)
    );
    expect(readFileSync(expectedFilename, { encoding: 'utf-8' })).toBe(
      mockReportContents
    );
  });
});
