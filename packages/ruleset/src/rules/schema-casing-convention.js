/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { schemaCasingConvention } from "../functions";

export const description =
  "Schema names must follow a specified case convention";
export const message = "{{error}}";
export const formats = [oas3];
export const given = ["$.components"];
export const severity = "warn";
export const then = {
  function: schemaCasingConvention,
  functionOptions: {
    match: "/^[A-Z]+[a-z0-9]+([A-Z]+[a-z0-9]*)*$/",
  },
};
