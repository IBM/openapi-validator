#!/usr/bin/env node
"use strict";

if (process.argv.length !== 3) {
	console.log("you need to specify a file");
} else {
	var filename = process.argv[2];
	console.log(filename);

	var validator = require("./testValidator").validate;

	// read json from other file
	var json = require("../mySwag.json");

	var result = validator(json);

	console.log(result);
}