/*jshint camelcase: false */
'use strict';

angular.module('joetzApp')
	.factory('userService', ['$rootScope', 'Restangular', 'userApi', '$q', function($rootScope, Restangular, userApi, $q) {
		var user = {};

		$rootScope.user = user;

		var userService = {};

		userService.login = function(email, password) {
			var defer = $q.defer();
			userApi.getAccessToken(email, password).then(function(response) {
				user.email = email;
				user.accessToken = response.access_token;

				defer.resolve();
			}, function() {
				defer.reject();
			});

			return defer.promise;
		};

		return userService;
	}]);