/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { schema } from "@stoplight/spectral-functions";

export const description =
  "Ensures that x-sdk-operations fields are properly structured";
export const message = "{{error}}";
export const given = "$.";
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: schema,
  functionOptions: {
    schema: {
      $ref: "../schemas/x-sdk-operations.json",
    },
  },
};
