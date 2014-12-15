'use strict';

angular.module('joetzApp')
	.factory('vacationService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/vacation',
			vacationService = {};

		/**
		 * GET-request om alle vakanties op te vragen
		 * @return {object} De promise van deze request
		 */
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

		/**
		 * GET-request om een specifieke vakantie op te vragen
		 * @param  {int} id De id van de vakantie
		 * @return {object}    De promise van deze request
		 */
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

		/**
		 * POST-request om een vakantie toe te voegen
		 * @param {object} vacationModel Een model met alle nodige attributen
		 */
		var _addVacation = function(vacationModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
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

		/**
		 * PUT-request om een specifieke vakantie up te daten
		 * @param  {object} vacationModel Een object met alle nodige attributen
		 * @param  {int} id            De id van de vakantie
		 * @return {object}               De promise van deze request
		 */
		var _updateVacation = function(vacationModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
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

		/**
		 * DELETE-request om een specifieke vakantie te verwijderen
		 * @param  {int} id De id van de vakantie
		 * @return {object}    De promise van deze request
		 */
		var _deleteVacation = function(id) {
			var defer = $q.defer(),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!userService.isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
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

		/**
		 * GET-request om alle Picasa-albums op te vragen
		 * @return {object} De promise van deze request
		 */
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

		/**
		 * GET-request om alle foto's uit een gegeven
		 * Picasa-album op te vragen
		 * @param  {string} id De id van het Picasa-album (19 lange string)
		 * @return {object}    De promise van deze request
		 */
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

		// Voeg de methoden toe aan het object
		vacationService.getVacations = _getVacations;
		vacationService.getVacation = _getVacation;
		vacationService.updateVacation = _updateVacation;
		vacationService.addVacation = _addVacation;
		vacationService.deleteVacation = _deleteVacation;
		vacationService.getPhotos = _getPhotos;
		vacationService.getAlbums = _getAlbums;

		// Return het object
		return vacationService;
	}]);