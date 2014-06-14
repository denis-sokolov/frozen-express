/**
 * This is internal implementation details.
 * To access error objects, use .errors on the main library object.
 * For example:
 *   require('frozen-express').errors.ConfigurationError
 */

'use strict';

var factory = require('error-factory');

var err = function(name) {
	return factory('FrozenExpress.'+name+'Error');
};

module.exports.ConfigurationError = err('Configuration');
