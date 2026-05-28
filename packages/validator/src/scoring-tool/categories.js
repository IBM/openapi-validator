/**
 * Copyright 2026 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// Define the list of categories, along with their scoring coefficients.
const categories = {
  usability: {
    coefficient: 1,
  },
  security: {
    coefficient: 5,
  },
  robustness: {
    coefficient: 2,
  },
  evolution: {
    coefficient: 3,
  },
};

export function getCategories() {
  return Object.keys(categories);
}

export function getCategoryCoefficient(category) {
  return categories[category].coefficient;
}
