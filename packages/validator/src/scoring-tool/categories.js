/**
 * Copyright 2024 IBM Corporation.
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

function getCategories() {
  return Object.keys(categories);
}

function getCategoryCoefficient(category) {
  return categories[category].coefficient;
}

module.exports = {
  getCategories,
  getCategoryCoefficient,
};
