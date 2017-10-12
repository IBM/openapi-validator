const readJson = require('load-json-file');

const getConfigObject = function (defaultMode, chalk) {

	let configObject = {};
	let configErrors = [];
	let validObject = true;

	let filename = '.validaterc';

	// if the user specified to run in default mode, no need to read the file
	if (!defaultMode){
		try {
			// the config file must be in the root folder of the project
			configObject = readJson.sync( __dirname + '/../../' + filename);
		}
		catch (err) {

			// if the user does not have a config file, run in default mode and warn them
			if (err.code === 'ENOENT') {
				console.log('\n' + chalk.yellow('Warning') + ` No ${chalk.underline(filename)} file found. The validator will run in ` + chalk.bold.cyan('default mode.'));
				console.log(`To configure the validator, the ${filename} file must be in the root directory of this project.`);
				defaultMode = true;
			}
			// this most likely means there is a problem in the json syntax itself
			else {
				console.log('\n' + chalk.red('Error') + ` There is a problem with the ${chalk.underline(filename)} file. See below for details.\n`);
				console.log(chalk.magenta(err) + '\n');
				process.exit(1);
			}
		}
	}


	// object defining all supported categories and rules that can be configured. holds all defaults
	let defaultObject = {
		operations : {
			no_consumes_for_put_or_post: 'error',
			get_op_has_consumes: 'warning',
			no_produces_for_get: 'error',
			no_operation_id: 'warning',
			no_summary: 'warning'
		},
		parameters : {
	    no_parameter_description: 'error',
	    snake_case_only: 'warning',
	    invalid_type_format_pair: 'error'
		},
		schemas : {
			invalid_type_format_pair: 'error',
			no_property_description: 'warning',
			description_mentions_json: 'warning'
		},
		walker : {
			no_empty_descriptions : 'error'
		}
	}

	if (defaultMode) {
		configObject = defaultObject;
	}
	else {

		// validate the user object

		// check that all categories are valid
		let allowedCategories = Object.keys(defaultObject);
		let userCategories = Object.keys(configObject);
		userCategories.forEach(function(category) {
			if (!allowedCategories.includes(category)) {
				validObject = false;
				configErrors.push({
					message: `'${category}' is not a valid category.`,
					correction: `Valid categories are: ${allowedCategories.join(', ')}`
				});
			}
			else {
				// check that all rules are valid
				let allowedRules = Object.keys(defaultObject[category]);
				let userRules = Object.keys(configObject[category]);
				userRules.forEach(function(rule) {
					if (!allowedRules.includes(rule)) {
						validObject = false;
						configErrors.push({
							message: `'${rule}' is not a valid rule for the ${category} category`,
							correction: `Valid rules are: ${allowedRules.join(', ')}`
						});
					}
					else {
						// check that all statuses are valid (either 'error', 'warning', or 'off')
						let allowedStatusValues = ['error', 'warning', 'off'];
						let userStatus = configObject[category][rule];
						if (!allowedStatusValues.includes(userStatus)) {
							validObject = false;
							configErrors.push({
								message: `'${userStatus}' is not a valid status for the ${rule} rule in the ${category} category.`,
								correction: `For any rule, the only valid statuses are: ${allowedStatusValues.join(', ')}`
							});
						}
					}
				});
			}
		});

		// if the object is valid, resolve any missing features
		//   and set all missing statuses to 'off'
		if (validObject) {
			let requiredCategories = allowedCategories;
			requiredCategories.forEach(function(category) {
				if (!userCategories.includes(category)) {
					configObject[category] = {};
				}
				let requiredRules = Object.keys(defaultObject[category]);
				let userRules = Object.keys(configObject[category]);
				requiredRules.forEach(function(rule) {
					if (!userRules.includes(rule)) {
						configObject[category][rule] = 'off';
					}
				});
			});
		}
		// if the object is not valid, exit and tell the user why
		else {
			console.log(chalk.red("\nError ") + `Invalid configuration in ${chalk.underline(filename)} file.\n`);
			configErrors.forEach(function(problem) {
				console.log(` - ${chalk.red(problem.message)}\n   ${chalk.magenta(problem.correction)}\n`);
			});
			process.exit(1);
		}
	}

	return configObject;
}

module.exports = getConfigObject;
