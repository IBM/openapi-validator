/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { operationMethods } from '../../src/utils';

describe('Utility function: operationMethods()', () => {
  it('should include relevant operation method names', async () => {
    expect(operationMethods).toEqual([
      'get',
      'head',
      'post',
      'put',
      'patch',
      'delete',
      'options',
      'trace',
    ]);
  });
});
