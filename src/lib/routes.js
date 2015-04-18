'use strict';

var api = {};

var detectExpress3Urls = function(app){
	if (!app.routes.get) {
		return [];
	}
	return app.routes.get.map(function(route){
		return route.path;
	});
};

/**
 * Warning!
 * This function accesses private API for Express 4
 */
var detectExpress4Urls = function(app){
	return app._router.stack.filter(function(routeItem){
		return !!routeItem.route;
	}).map(function(routeItem){
		return routeItem.route.path;
	});
};

/**
 * Detect URLs for routes for an app
 *
 * detectUrls(app) === ['/about', '/company']
 *
 * @private
 * @param Express app
 * @return [string]
 */
api.detectUrls = function(app){
	if (app.routes) {
		return detectExpress3Urls(app);
	}

	if (app._router) {
		return detectExpress4Urls(app);
	}

	return [];
};

module.exports = api;
