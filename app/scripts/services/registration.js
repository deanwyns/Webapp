'use strict';

angular.module('joetzApp')
	.factory('registrationService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/registration',
			registrationService = {};

		/**
		 * GET-request om alle inschrijvingen te laden
		 * @return {object}	De promise van deze request 
		 */
		var _getRegistrations = function() {
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

		/**
		 * GET-request voor een specfieke inschrijving
		 * @param  {int} id De id van de inschrijving die je wilt opvragen
		 * @return {object}    De promise van de request
		 */
		var _getRegistration = function(id) {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
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

		/**
		 * POST-request om een inschrijving toe te voegen
		 * @param {object} registrationModel Een model met alle nodige attributen
		 */
		var _addRegistration = function(registrationModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(registrationModel),
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
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * PUT-request om een specifieke inschrijving up te daten
		 * @param  {object} registrationModel Een object met alle nodige attributen
		 * @param  {int} id                De id van de inschrijving die je wenst up te daten
		 * @return {object}                   De promise van deze request
		 */
		var _updateRegistration = function(registrationModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(registrationModel),
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
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * DELETE-request om een specifieke inschrijving te verwijderen
		 * @param  {int} id De id van de inschrijving die je wenst te verwijderen
		 * @return {object}    De promise van deze request
		 */
		var _deleteRegistration = function(id) {
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

		// Voeg de methoden toe aan het object
		registrationService.getRegistrations = _getRegistrations;
		registrationService.getRegistration = _getRegistration;
		registrationService.updateRegistration = _updateRegistration;
		registrationService.addRegistration = _addRegistration;
		registrationService.deleteRegistration = _deleteRegistration;

		// Return het object
		return registrationService;
	}]);