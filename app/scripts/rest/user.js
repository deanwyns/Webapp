/*jshint camelcase: false */
'use strict';

angular.module('joetzApp')
	.factory('userApi', ['$rootScope', 'Restangular', function($rootScope, Restangular) {
		var userApi = {};
		userApi.getAccessToken = function(user) {
			var accessTokenResult = Restangular.all('access_token')
				.post('grant_type=password&username=' +
					user.email + '&password=' + user.password +
					'&client_id=NZCYDfK2AWhrZF38mNg9uXQGN2hhzWj7hQHcLuBB' +
					'&client_secret=Dw!\'Lr_:brzeX?Bm8Uc]>\\JrtKmjt{]->Ru.3>Q_', undefined, {
    					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				});

			return accessTokenResult;
		};

		return userApi;
	}]);