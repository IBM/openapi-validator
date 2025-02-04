/**
 * Copyright 2024-2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { isDateBasedName, isDateBasedValue } = require('../../src/utils');

describe('Date-based utility functions', () => {
  describe('isDateBasedValue()', () => {
    // Positive tests.
    it('should return `true` for date time values', () => {
      expect(isDateBasedValue('1990-12-31T23:59:60Z')).toBe(true);
      expect(isDateBasedValue('1990-12-31T15:59:60-08:00')).toBe(true);
      expect(isDateBasedValue('2023-01-01')).toBe(true);
      expect(isDateBasedValue('01/01/2023')).toBe(true);
      expect(isDateBasedValue('Mon, 03 Jul 2023 16:15:00 +0000')).toBe(true);
      expect(isDateBasedValue('Monday, 03-Jul-23 16:15:00 GMT')).toBe(true);
      expect(isDateBasedValue('Mon, 03 Jul 23 16:15:00 +0000')).toBe(true);
      expect(isDateBasedValue('2023-07-03T16:15:00+00:00')).toBe(true);
      expect(isDateBasedValue('July 3, 2023, 4:15 PM')).toBe(true);
      expect(isDateBasedValue('Oct. 31')).toBe(true);
    });

    // Negative tests.
    it('should return `false` for non-date time values', () => {
      expect(isDateBasedValue('This certificate is good until June 2032')).toBe(
        false
      );
      expect(
        isDateBasedValue('0000-0000-0000-0000/abc/2022/2/22/12345678_data.json')
      ).toBe(false);
      expect(isDateBasedValue('Octopus')).toBe(false);
      expect(isDateBasedValue('Januaryuary 31')).toBe(false);
      expect(isDateBasedValue('12345678')).toBe(false);
      expect(isDateBasedValue('0001-01-2000')).toBe(false);
      expect(isDateBasedValue('10.1.24.1')).toBe(false);
      expect(isDateBasedValue('10.1.255.1')).toBe(false);
      expect(isDateBasedValue('02:00:04:00:C4:6A')).toBe(false);
      expect(isDateBasedValue('02:00:04:00:03:00')).toBe(false);
      expect(isDateBasedValue(undefined)).toBe(false);
      expect(isDateBasedValue(null)).toBe(false);
      expect(isDateBasedValue(42)).toBe(false);
    });
  });

  describe('isDateBasedName()', () => {
    // Positive tests.
    it('should return `true` for date time values', () => {
      expect(isDateBasedName('created_at')).toBe(true);
      expect(isDateBasedName('modified_at')).toBe(true);
      expect(isDateBasedName('updated_at')).toBe(true);
      expect(isDateBasedName('created_on')).toBe(true);
      expect(isDateBasedName('modified_on')).toBe(true);
      expect(isDateBasedName('expires_on')).toBe(true);
      expect(isDateBasedName('first_date')).toBe(true);
      expect(isDateBasedName('new_date_when')).toBe(true);
      expect(isDateBasedName('date_next')).toBe(true);
      expect(isDateBasedName('a_time_for_updating')).toBe(true);
      expect(isDateBasedName('time_is')).toBe(true);
      expect(isDateBasedName('photo_timestamp')).toBe(true);
      expect(isDateBasedName('photo_timestamp_value')).toBe(true);
      expect(isDateBasedName('timestamp_value')).toBe(true);
      expect(isDateBasedName('created')).toBe(true);
      expect(isDateBasedName('updated')).toBe(true);
      expect(isDateBasedName('modified')).toBe(true);
      expect(isDateBasedName('expired')).toBe(true);
      expect(isDateBasedName('expires')).toBe(true);
      expect(isDateBasedName('start_time')).toBe(true);
      expect(isDateBasedName('start_date')).toBe(true);
      expect(isDateBasedName('end_time')).toBe(true);
      expect(isDateBasedName('end_date')).toBe(true);
      expect(isDateBasedName('create_time')).toBe(true);
      expect(isDateBasedName('create_date')).toBe(true);
      expect(isDateBasedName('created_time')).toBe(true);
      expect(isDateBasedName('created_date')).toBe(true);
      expect(isDateBasedName('modify_time')).toBe(true);
      expect(isDateBasedName('modify_date')).toBe(true);
      expect(isDateBasedName('modified_time')).toBe(true);
      expect(isDateBasedName('modified_date')).toBe(true);
      expect(isDateBasedName('update_time')).toBe(true);
      expect(isDateBasedName('update_date')).toBe(true);
    });

    // Negative tests.
    it('should return `false` for non-date time values', () => {
      expect(isDateBasedName('running_time')).toBe(false);
      expect(isDateBasedName('timeandtimeagain')).toBe(false);
      expect(isDateBasedName('created_for')).toBe(false);
      expect(isDateBasedName('ttl')).toBe(false);
      expect(isDateBasedName('octopus')).toBe(false);
      expect(isDateBasedName(undefined)).toBe(false);
      expect(isDateBasedName(null)).toBe(false);
      expect(isDateBasedName(42)).toBe(false);
    });
  });
});
