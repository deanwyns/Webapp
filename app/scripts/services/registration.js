'use strict';

angular.module('joetzApp')
	.factory('registrationService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/registration',
			registrationService = {};

		var _getRegistrations = function() {
			var defer = $q.defer(),
				headers = {};

			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = userService.getToken();

			$http({
				method: 'GET',
				url: baseUrl,
				headers: headers
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _getRegistration = function(id) {
			var defer = $q.defer(),
				headers = {};

			headers.Authorization = userService.getToken();

			$http({
				method: 'GET',
				url: baseUrl + '/' + id,
				headers: headers
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _addRegistration = function(registrationModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(registrationModel),
				headers = {};

			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = userService.getToken();
			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http({
				method: 'POST',
				url: baseUrl,
				data: data,
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _updateRegistration = function(registrationModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(registrationModel),
				headers = {};

			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = userService.getToken();
			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http({
				method: 'PUT',
				url: baseUrl + '/' + id,
				data: data,
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _deleteRegistration = function(id) {
			var defer = $q.defer(),
				headers = {};

			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = userService.getToken();

			$http({
				method: 'DELETE',
				url: baseUrl + '/' + id,
				headers: headers
			}).success(function() {
				defer.resolve();
			}).error(function() {
				defer.reject();
			});

			return defer.promise;
		};

		registrationService.getRegistrations = _getRegistrations;
		registrationService.getRegistration = _getRegistration;
		registrationService.updateRegistration = _updateRegistration;
		registrationService.addRegistration = _addRegistration;
		registrationService.deleteRegistration = _deleteRegistration;

		return registrationService;
	}]);