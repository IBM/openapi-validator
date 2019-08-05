// Expose validator utils as a module with each sub-module as a property

module.exports.checkCase = require('./caseConventionCheck');
module.exports.walk = require('./walk');
module.exports.isParameterObject = require('./isParameter');
