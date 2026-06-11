/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { enumeration } from "@stoplight/spectral-functions";

export const description = "All request bodies MUST be structured as an object";
export const given =
  '$.paths[*][*].requestBody.content[?(@property ~= "^application\\\\/json(;.*)*$")].schema';
export const severity = "error";
export const then = {
  field: "type",
  function: enumeration,
  functionOptions: {
    values: ["object"],
  },
};
