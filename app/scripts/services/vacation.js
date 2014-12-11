'use strict';

angular.module('joetzApp')
	.factory('vacationService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/vacation',
			vacationService = {};

		var _getVacations = function() {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl
			}).success(function(response) {
				console.log(response);
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _getVacation = function(id) {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + '/' + id
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _addVacation = function(vacationModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
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
				console.log(response);
				defer.resolve(response);
			}).error(function(err) {
				console.log(err);
				defer.reject(err);
			});

			return defer.promise;
		};

		var _updateVacation = function(vacationModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
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
				console.log(response);
				defer.resolve(response);
			}).error(function(err) {
				console.log(err);
				defer.reject(err);
			});

			return defer.promise;
		};

		var _deleteVacation = function(id) {
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

		var _getAlbums = function() {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + '/albums'
			}).success(function(albums) {
				defer.resolve(albums);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _getPhotos = function(id) {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + '/' + id + '/photos'
			}).success(function(photos) {
				defer.resolve(photos);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		vacationService.getVacations = _getVacations;
		vacationService.getVacation = _getVacation;
		vacationService.updateVacation = _updateVacation;
		vacationService.addVacation = _addVacation;
		vacationService.deleteVacation = _deleteVacation;
		vacationService.getPhotos = _getPhotos;
		vacationService.getAlbums = _getAlbums;

		return vacationService;
	}]);