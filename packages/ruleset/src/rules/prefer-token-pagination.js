/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { paths } from "@ibm-cloud/openapi-ruleset-utilities/src/collections";
import { oas3 } from "@stoplight/spectral-formats";
import { preferTokenPagination } from "../functions";

export const description =
  "Paginated list operations should use token-based pagination, rather than offset/limit pagination.";
export const message = "{{error}}";
export const given = paths;
export const severity = "warn";
export const formats = [oas3];
export const resolved = true;
export const then = {
  function: preferTokenPagination,
};
