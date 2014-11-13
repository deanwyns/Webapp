'use strict';

angular.module('joetzApp')
	.factory('userService', ['$http', 'localStorageService', '$q', 'queryBuilder', function($http, localStorageService, $q, queryBuilder) {
		var baseUrl = 'http://lloyd.deanwyns.me/api';

		var	userService = {},
			_user = {
				email: '',
				token: '',
				isAuth: false
			};

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
				defer.resolve(response.users);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

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
				defer.resolve(response.user);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

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
				var token = response.token_type + ' ' + response.access_token;
				localStorageService.set('authData', {
					token: token
				});

				_user.token = token;
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

		var _register = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

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

		var _update = function(updateModel, id) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(updateModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _logout = function() {
			localStorageService.remove('authData');

			_user.token = '';
			_user.isAuth = false;
		};

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

		var _getProfile = function() {
			var defer = $q.defer(),
				headers = {};

			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + '/user/me',
				headers: headers
			}).success(function(response) {
				console.log(response);
				var userResponse = response.user;
				//_user.firstName = userResponse.first_name;
				//_user.lastName = userResponse.last_name;
				_user.email = userResponse.email;

				defer.resolve();
			}).error(function() {
				defer.reject();
			});

			return defer.promise;
		};

		var _getLocalUser = function() {
			return _user;
		};

		var _isAuthenticated = function() {
			return _user.isAuth;
		};

		var _getToken = function() {
			return _user.token;
		};

		userService.init = _init;
		userService.login = _login;
		userService.register = _register;
		userService.update = _update;
		userService.logout = _logout;
		userService.getLocalUser = _getLocalUser;
		userService.isAuthenticated = _isAuthenticated;
		userService.getToken = _getToken;

		userService.getUsers = _getUsers;
		userService.getUser = _getUser;

		userService.getProfile = _getProfile;

		return userService;
	}]);