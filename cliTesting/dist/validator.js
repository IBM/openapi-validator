"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validate = validate;
function validate(testJson) {
	let errors = [];
	let warnings = [];

	if (!testJson.requiredKey) {
		errors.push("error! no required key!");
	}

	if (testJson.warning) {
		warnings.push("warning!");
	}

	return { errors, warnings };
}