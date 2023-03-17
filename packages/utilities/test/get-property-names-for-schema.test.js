/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getPropertyNamesForSchema } = require('../src');

describe('Utility function: getPropertyNamesForSchema()', () => {
  it('should return `[]` for `undefined`', async () => {
    expect(getPropertyNamesForSchema(undefined)).toEqual([]);
  });

  it('should return `[]` for `null`', async () => {
    expect(getPropertyNamesForSchema(null)).toEqual([]);
  });

  it('should return `[]` for empty object', async () => {
    expect(getPropertyNamesForSchema({})).toEqual([]);
  });

  it('should return property names for simple schema', async () => {
    expect(
      getPropertyNamesForSchema({
        properties: {
          one: {},
          two: {},
          three: {},
        },
      }).sort()
    ).toEqual(['three', 'two', 'one'].sort());
  });

  it('should return property names for composed schema', async () => {
    expect(
      getPropertyNamesForSchema({
        properties: {
          one: {},
        },
        allOf: [
          {
            properties: {
              two: {},
            },
          },
        ],
        oneOf: [
          {
            properties: {
              three: {},
            },
          },
        ],
        anyOf: [
          {
            properties: {
              four: {},
            },
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should return property names for deeply composed schema', async () => {
    expect(
      getPropertyNamesForSchema({
        properties: {
          one: {},
        },
        allOf: [
          {
            properties: {
              two: {},
            },
            oneOf: [
              {
                properties: {
                  three: {},
                },
                anyOf: [
                  {
                    properties: {
                      four: {},
                    },
                  },
                ],
              },
            ],
          },
        ],
      }).sort()
    ).toEqual(['four', 'three', 'two', 'one'].sort());
  });

  it('should de-duplicate property names for composed schema', async () => {
    expect(
      getPropertyNamesForSchema({
        properties: {
          one: {},
        },
        allOf: [
          {
            properties: {
              one: {},
            },
          },
        ],
      })
    ).toEqual(['one']);
  });

  it('should filter property names based on name', async () => {
    expect(
      getPropertyNamesForSchema(
        {
          properties: {
            one: {},
            two: {},
            three: {},
          },
        },
        name => name.indexOf('o') !== -1
      ).sort()
    ).toEqual(['one', 'two'].sort());
  });

  it('should filter property names based on schema', async () => {
    expect(
      getPropertyNamesForSchema(
        {
          properties: {
            one: {},
            two: {},
            three: { nullable: true },
          },
        },
        (_, schema) => schema.nullable === true
      )
    ).toEqual(['three']);
  });
});
