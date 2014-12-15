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

		var _deleteUser = function(id) {
			var defer = $q.defer(),
				headers = {};

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

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

		var _registerMonitor = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			if(_getType() !== 'admin') {
				defer.reject('Niet toegelaten');
				return defer.promise;
			}

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _registerAdmin = function(registerModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registerModel);

			if(_getType() !== 'admin') {
				defer.reject('Niet toegelaten');
				return defer.promise;
			}

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _updateMe = function(updateModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(updateModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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
				var userResponse = response.data;
				//_user.firstName = userResponse.first_name;
				//_user.lastName = userResponse.last_name;
				//_user.email = userResponse.email;
				//_user.type = userResponse.type;

				for(var attribute in userResponse) {
					_user[attribute] = userResponse[attribute];
				}

				defer.resolve();
			}).error(function() {
				defer.reject();
			});

			return defer.promise;
		};

		var _getChildren = function() {
			var defer = $q.defer(),
				headers = {};

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

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

		var _getRegistrationsByChild = function(childId) {
			var defer = $q.defer(),
				headers = {};

			if(!_isAuthenticated()) {
				defer.reject('Niet toegestaan');
				return defer.promise;
			}

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

		var _getChild = function(id) {
			var defer = $q.defer(),
				headers = {};

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

		var _addChild = function(childModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(childModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _updateChild = function(childModel, childId) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(childModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _saveRegistration = function(registrationModel, childId) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(registrationModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _getChildAddress = function(id) {
			var defer = $q.defer(),
				headers = {};

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

		var _getAddresses = function() {
			var defer = $q.defer(),
				headers = {};

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

		var _saveAddress = function(addressModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(addressModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _addSocialNetwork = function(socialNetworkModel) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(socialNetworkModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _updateSocialNetwork = function(socialNetworkModel, id) {
			var defer = $q.defer(),
				headers = {},
				data = queryBuilder.build(socialNetworkModel);

			headers['Content-Type'] = 'application/x-www-form-urlencoded';
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

		var _deleteSocialNetwork = function(id) {
			var defer = $q.defer(),
				headers = {};

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

		var _getLocalUser = function() {
			return _user;
		};

		var _getType = function() {
			return _user.type;
		};

		var _isAuthenticated = function() {
			return _user.isAuth;
		};

		var _getToken = function() {
			return _user.token;
		};

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

		return userService;
	}]);