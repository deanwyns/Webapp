'use strict';

angular.module('joetzApp')
	.factory('userService', ['$http', 'localStorageService', '$q', function($http, localStorageService, $q) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/',
			defaultHeaders = {
				'Accept': 'application/vnd.joetz.v1+json'
			};

		var	userService = {},
			_user = {
				firstName: '',
				lastName: '',
				email: '',
				token: '',
				isAuth: false
			};

		var _login = function(loginModel) {
			var data = 'grant_type=password&client_id=NZCYDfK2AWhrZF38mNg9uXQGN2hhzWj7hQHcLuBB' +
				'&client_secret=Dw!\'Lr_:brzeX?Bm8Uc]>\\JrtKmjt{]->Ru.3>Q_' +
				'&username=' + loginModel.email + '&password=' + loginModel.password,
				defer = $q.defer();

			var headers = defaultHeaders;
			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http({
				method: 'POST',
				url: baseUrl + 'access_token',
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

		var _logout = function() {
			localStorageService.remove('authData');

			_user.token = '';
			_user.isAuth = false;
		};

		var _init = function() {
			var authData = localStorageService.get('authData');
			var defer = $q.defer();

			if(authData) {
				_user.token = authData.token;
				_getProfile().then(function() {
					_user.isAuth = true;

					defer.resolve(_user);
				}, function() {
					_logout();

					defer.reject();
				});
			}

			return defer.promise;
		};

		var _getProfile = function() {
			var defer = $q.defer();

			var headers = defaultHeaders;
			headers.Authorization = _user.token;

			$http({
				method: 'GET',
				url: baseUrl + 'user/me',
				headers: headers
			}).success(function(response) {
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

		var _getUser = function() {
			return _user;
		};

		userService.login = _login;
		userService.logout = _logout;
		userService.init = _init;
		userService.getUser = _getUser;

		userService.getProfile = _getProfile;

		return userService;
	}]);