/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { oas3 } from "@stoplight/spectral-formats";
import { resourceResponseConsistency } from "../functions";

export const description =
  'Operations that create or update a resource should return the same schema as the "GET" request for the resource.';
export const message = "{{error}}";
export const formats = [oas3];
export const given = [`$.paths[*][put,post,patch]`];
export const severity = "warn";
export const resolved = true;
export const then = {
  function: resourceResponseConsistency,
};
