'use strict';

angular.module('joetzApp')
	.factory('userService', ['$http', 'localStorageService', '$q', function($http, localStorageService, $q) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/',
			defaultHeaders = {
				'Accept': 'application/vnd.joetz.v1+json'
			};

		var authData = localStorageService.get('authData'),
			userService = {},
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
				_user.isAuth = true;

				defer.resolve(response);
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
			if(authData) {
				_user.token = authData.token;
				_user.isAuth = true;

				_getProfile().then(function() {
					console.log(_user);
				});
			}
		};

		var _getProfile = function() {
			var defer = $q.defer();

			var headers = defaultHeaders;
			headers.Authorization = authData.token;

			$http({
				method: 'GET',
				url: baseUrl + 'user/me',
				headers: headers
			}).success(function(response) {
				console.log(response);
				_user.firstName = response.first_name;
				_user.lastName = response.last_name;
				_user.email = response.email;

				defer.resolve(_user);
			}).error(function(err) {
				defer.reject(err);
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