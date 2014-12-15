'use strict';

angular.module('joetzApp')
	.factory('userService', ['$http', 'localStorageService', '$q', 'queryBuilder', function($http, localStorageService, $q, queryBuilder) {
		var baseUrl = 'http://lloyd.deanwyns.me/api';

		var	userService = {},
			_user = {
				email: '',
				token: '',
				isAuth: false,
				type: ''
			};

		/**
		 * GET-request om alle gebruikers op te vragen
		 * @return {object} De promise van deze request
		 */
		var _getUsers = function() {
			var defer = $q.defer(),
				headers = {};

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = _getToken();

			$http({
				method: 'GET',
				url: baseUrl + '/user',
				headers: headers
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * GET-request om een specifieke gebruiker op te vragen
		 * @param  {int} id De id van de gebruiker die je wenst op te vragen
		 * @return {object}    De promise van deze request
		 */
		var _getUser = function(id) {
			var defer = $q.defer(),
				headers = {};

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			headers.Authorization = _getToken();

			$http({
				method: 'GET',
				url: baseUrl + '/user/' + id,
				headers: headers
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * POST-request om een token te verkrijgen
		 * @param  {object} loginModel Een object met alle nodige attributen
		 * @return {object}            De promise van deze request
		 */
		var _login = function(loginModel) {
			var data = 'grant_type=password&client_id=NZCYDfK2AWhrZF38mNg9uXQGN2hhzWj7hQHcLuBB' +
				'&client_secret=Dw!\'Lr_:brzeX?Bm8Uc]>\\JrtKmjt{]->Ru.3>Q_' +
				'&username=' + loginModel.email + '&password=' + loginModel.password,
				defer = $q.defer(),
				headers = {};

			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http({
				method: 'POST',
				url: baseUrl + '/access_token',
				data: data,
				headers: headers
			}).success(function(response) {
				// Bij succes slaan we de token op in local storage met key "authData"
				var token = response.token_type + ' ' + response.access_token;
				localStorageService.set('authData', {
					token: token
				});

				_user.token = token;
				// Vraag het profiel op
				_getProfile().then(function() {
					_user.isAuth = true;

					defer.resolve(_user);
				}, function(err) {
					_logout();
					defer.reject(err);
				});
			}).error(function(err) {
				_logout();
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * DELETE-request om een specifieke gebruiker te verwijderen
		 * @param  {int} id De id van de gebruiker die je wenst te verwijderen
		 * @return {object}    De promise van deze request
		 */
		var _deleteUser = function(id) {
			var defer = $q.defer(),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
			headers.Authorization = userService.getToken();

			$http({
				method: 'DELETE',
				url: baseUrl + '/user/' + id,
				headers: headers
			}).success(function() {
				defer.resolve();
			}).error(function() {
				defer.reject();
			});

			return defer.promise;
		};

		/**
		 * POST-request om een gebruiker te registreren
		 * Iedereen kan dit doen
		 * @param  {object} registerModel Een object met alle nodige attributen
		 * @return {object}               De promise van deze request
		 */
		var _register = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http({
				method: 'POST',
				url: baseUrl + '/user',
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
		 * POST-request om een monitor te registreren
		 * @param  {object} registerModel Een object met alle nodige attributen
		 * @return {object}               De promise van deze request
		 */
		var _registerMonitor = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			// Als de gebruiker geen admin is, dit niet toestaan
			if(_getType() !== 'admin') {
				defer.reject('Niet toegelaten');
				return defer.promise;
			}

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = userService.getToken();

			$http({
				method: 'POST',
				url: baseUrl + '/user/monitor',
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
		 * POST-request om een admin te registreren
		 * @param  {object} registerModel Een object met alle nodige attributen
		 * @return {object}               De promise van deze request
		 */
		var _registerAdmin = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			// Als de gebruiker geen admin is, dit niet toestaan
			if(_getType() !== 'admin') {
				defer.reject('Niet toegelaten');
				return defer.promise;
			}

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = userService.getToken();

			$http({
				method: 'POST',
				url: baseUrl + '/user/admin',
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
		 * PUT-request om een gebruiker up te daten
		 * @param  {object} updateModel Een model met alle nodige attributen
		 * @param  {int} id          De id van de gebruiker die je wenst up te daten
		 * @return {object}             De promise van deze request
		 */
		var _update = function(updateModel, id) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(updateModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _getToken();

			$http({
				method: 'PUT',
				url: baseUrl + '/user/' + id,
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
		 * PUT-request om een gebruiker zijn eigen gegevens te laten aanpassen
		 * @param  {object} updateModel Een model met alle nodige attributen
		 * @return {object}             De promise van deze request
		 */
		var _updateMe = function(updateModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(updateModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _getToken();

			$http({
				method: 'PUT',
				url: baseUrl + '/user/me',
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
		 * Logt de gebruiker uit.
		 * @return {void} 
		 */
		var _logout = function() {
			localStorageService.remove('authData');

			_user.token = '';
			_user.isAuth = false;
		};

		/**
		 * Initialiseert de gebruiker indien er gegevens
		 * in de local storage zijn aangetroffen
		 * @return {object} De promise, of het gelukt is
		 */
		var _init = function() {
			var authData = localStorageService.get('authData'),
				defer = $q.defer();

			if(authData) {
				_user.token = authData.token;
				_getProfile().then(function() {
					_user.isAuth = true;

					defer.resolve(_user);
				}, function() {
					_logout();

					defer.reject();
				});
			} else {
				defer.reject();
			}

			return defer.promise;
		};

		/**
		 * GET-request om het profiel van de huidige ingelogde gebruiker 
		 * op te vragen
		 * @return {object} De promise van deze request
		 */
		var _getProfile = function() {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + '/user/me',
				headers: headers
			}).success(function(response) {
				var userResponse = response.data;

				for(var attribute in userResponse) {
					_user[attribute] = userResponse[attribute];
				}

				defer.resolve();
			}).error(function() {
				defer.reject();
			});

			return defer.promise;
		};

		/**
		 * GET-request om de kinderen van de huidige ingelogde gebruiker
		 * op te vragen
		 * @return {object} De promise van deze request
		 */
		var _getChildren = function() {
			var defer = $q.defer(),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
			headers.Authorization = _getToken();

			$http({
				method: 'GET',
				url: baseUrl + '/me/children',
				headers: headers
			}).success(function(response) {
				defer.resolve(response.childrens);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * GET-request om alle inschrijvingen van een bepaald kind op te halen
		 * @param  {int} childId De id van het kind
		 * @return {object}         De promise van deze request
		 */
		var _getRegistrationsByChild = function(childId) {
			var defer = $q.defer(),
				headers = {};

			// Als de gebruiker niet ingelogd is, dit niet toestaan
			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

			// We sturen de token mee
			headers.Authorization = _getToken();

			$http({
				method: 'GET',
				url: baseUrl + '/me/' + childId + '/registrations',
				headers: headers
			}).success(function(response) {
				defer.resolve(response.childrens);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};


		/**
		 * GET-request om een bepaald kind op te vragen
		 * @param  {int} id De id van het kind
		 * @return {object}    De promise van deze request
		 */
		var _getChild = function(id) {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + '/user/me/' + id,
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * POST-request om een nieuw kind toe te voegen
		 * @param {object} childModel Een model met alle nodige attributen
		 */
		var _addChild = function(childModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(childModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'POST',
				url: baseUrl + '/user/me/children',
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
		 * PUT-request om een specifiek kind up te daten
		 * @param  {object} childModel Een model met alle nodige attributen
		 * @param  {int} childId    De id van het kind
		 * @return {object}            De promise van deze request
		 */
		var _updateChild = function(childModel, childId) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(childModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'POST',
				url: baseUrl + '/user/me/' + childId,
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
		 * POST-request om een inschrijving op te slaan
		 * @param  {object} registrationModel Een model met alle nodige attributen
		 * @param  {int} childId           De id van het kind dat je inschrijft
		 * @return {object}                   De promise van deze request
		 */
		var _saveRegistration = function(registrationModel, childId) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registrationModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'POST',
				url: baseUrl + '/user/me/' + childId + '/register',
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
		 * GET-request om het adres van een specifiek kind op te vragen
		 * @param  {int} id De id van het kind
		 * @return {object}    De promise van deze request
		 */
		var _getChildAddress = function(id) {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + '/user/me/' + id + '/address',
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * GET-request om alle adressen op te vragen
		 * @return {object} De promise van deze request
		 */
		var _getAddresses = function() {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + '/user/me/address',
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * POST-request om een nieuw adres toe te voegen
		 * @param  {object} addressModel Een model met alle nodige attributen
		 * @return {object}              De promise van deze request
		 */
		var _saveAddress = function(addressModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(addressModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'POST',
				url: baseUrl + '/address/make',
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
		 * POST-request om een sociaal netwerk toe te voegen aan je profiel
		 * @param {object} socialNetworkModel Een model met alle nodige attributen
		 */
		var _addSocialNetwork = function(socialNetworkModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(socialNetworkModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'POST',
				url: baseUrl + '/user/me/addsocialnetwork',
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
		 * PUT-request om een sociaal netwerk up te daten
		 * @param  {object} socialNetworkModel Een model met alle nodige attributen
		 * @param  {int} id                 De id van het sociaal netwerk
		 * @return {object}                    De promise van deze request
		 */
		var _updateSocialNetwork = function(socialNetworkModel, id) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(socialNetworkModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'PUT',
				url: baseUrl + '/user/me/' + id + '/socialnetwork',
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
		 * DELETE-request om een specifieke sociaal netwerk te verwijderen
		 * @param  {int} id De id van het sociaal netwerk
		 * @return {object}    De promise van deze request
		 */
		var _deleteSocialNetwork = function(id) {
			var defer = $q.defer(),
				headers = {};

			// We sturen de token mee
			headers.Authorization = _user.token;

			$http({
				method: 'DELETE',
				url: baseUrl + '/user/me/' + id + '/socialnetwork',
				headers: headers
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * GET-request om alle monitors op te vragen
		 * @return {object} De promise van deze request
		 */
		var _getMonitors = function() {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + '/monitor'
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/**
		 * GET-request om een specifieke monitor op te vragen
		 * @param  {int} id De id van de monitor
		 * @return {object}    De promise van deze request
		 */
		var _getMonitor = function(id) {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl + '/monitor/' + id
			}).success(function(response) {
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		/** Geeft de lokale gebruiker terug */
		var _getLocalUser = function() {
			return _user;
		};

		/** Geeft het type van de lokale gebruiker terug */
		var _getType = function() {
			return _user.type;
		};

		/** Geeft terug of de gebruiker al dan niet ingelogd is */
		var _isAuthenticated = function() {
			return _user.isAuth;
		};

		/** Geeft de token van de gebruiker terug */
		var _getToken = function() {
			return _user.token;
		};

		// Voeg de methoden toe aan het object
		userService.init = _init;
		userService.login = _login;
		userService.deleteUser = _deleteUser;
		userService.register = _register;
		userService.registerMonitor = _registerMonitor;
		userService.registerAdmin = _registerAdmin;
		userService.update = _update;
		userService.updateMe = _updateMe;
		userService.logout = _logout;
		userService.getLocalUser = _getLocalUser;
		userService.getType = _getType;
		userService.isAuthenticated = _isAuthenticated;
		userService.getToken = _getToken;

		userService.getChild = _getChild;
		userService.addChild = _addChild;
		userService.updateChild = _updateChild;
		userService.saveRegistration = _saveRegistration;
		userService.getRegistrationsByChild = _getRegistrationsByChild;

		userService.getUsers = _getUsers;
		userService.getUser = _getUser;

		userService.getProfile = _getProfile;
		userService.getChildren = _getChildren;

		userService.getMonitors = _getMonitors;
		userService.getmonitor = _getMonitor;

		userService.getChildAddress = _getChildAddress;
		userService.getAddresses = _getAddresses;
		userService.saveAddress = _saveAddress;

		userService.addSocialNetwork = _addSocialNetwork;
		userService.updateSocialNetwork = _updateSocialNetwork;
		userService.deleteSocialNetwork = _deleteSocialNetwork;

		// Return het object
		return userService;
	}]);