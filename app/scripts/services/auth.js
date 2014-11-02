'use strict';

angular.module('joetzApp')
	.factory('authService', ['$http', 'localStorageService', '$q', function($http, localStorageService, $q) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/',
			defaultHeaders = {
				'Accept': 'application/vnd.joetz.v1+json'
			};

		var	authService = {};

		var	_authentication = {
			isAuth: false,
			email: ''
		};

		var _login = function(loginModel) {
			var data = 'grant_type=password&client_id=NZCYDfK2AWhrZF38mNg9uXQGN2hhzWj7hQHcLuBB' +
				'&client_secret=Dw!\'Lr_:brzeX?Bm8Uc]>\\JrtKmjt{]->Ru.3>Q_' +
				'&username=' + loginModel.email + '&password=' + loginModel.password,
				defer = $q.defer();

			var headers = defaultHeaders;
			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			$http.post(baseUrl + 'access_token', data, { headers: headers }).success(function(response) {
				localStorageService.set('authData', {
					token: response.token_type + ' ' + response.access_token,
					email: loginModel.email
				});

				_authentication.isAuth = true;
				_authentication.email = loginModel.email;

				defer.resolve(response);
			}).error(function(err) {
				_logout();
				defer.reject(err);
			});

			return defer.promise;
		};

		var _logout = function() {
			localStorageService.remove('authData');

			_authentication.isAuth = false;
			_authentication.email = '';
		};

		var _init = function() {
			var authData = localStorageService.get('authData');
			if(authData) {
				_authentication.isAuth = true;
				_authentication.email = authData.email;
			}
		};

		authService.login = _login;
		authService.logout = _logout;
		authService.init = _init;

		return authService;
	}]);