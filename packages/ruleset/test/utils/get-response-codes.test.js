/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getResponseCodes } = require('../../src/utils');

describe('Utility function: getResponseCodes', () => {
  it('should return a tuple of empty arrays if responses is undefined', () => {
    const responses = undefined;
    const [statusCodes, successCodes] = getResponseCodes(responses);
    expect(Array.isArray(statusCodes)).toBe(true);
    expect(statusCodes.length).toBe(0);
    expect(Array.isArray(successCodes)).toBe(true);
    expect(successCodes.length).toBe(0);
  });

  it('should return a populated status array and empty success array', () => {
    const responses = {
      400: {},
      401: {},
      500: {},
    };
    const [statusCodes, successCodes] = getResponseCodes(responses);
    expect(Array.isArray(statusCodes)).toBe(true);
    expect(statusCodes).toStrictEqual(['400', '401', '500']);
    expect(Array.isArray(successCodes)).toBe(true);
    expect(successCodes.length).toBe(0);
  });

  it('should populate both success and status array with correct codes', () => {
    const responses = {
      200: {},
      201: {},
      400: {},
      401: {},
      500: {},
    };
    const [statusCodes, successCodes] = getResponseCodes(responses);
    expect(Array.isArray(statusCodes)).toBe(true);
    expect(statusCodes).toStrictEqual(['200', '201', '400', '401', '500']);
    expect(Array.isArray(successCodes)).toBe(true);
    expect(successCodes).toStrictEqual(['200', '201']);
  });
});
