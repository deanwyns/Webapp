'use strict';

angular.module('joetzApp')
	.factory('categoryService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/category',
			categoryService = {};

		var _getCategories = function() {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl
			}).success(function(response) {
				defer.resolve(response.data);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _getCategory = function(id) {
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

		var _addCategory = function(categoryModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(categoryModel),
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
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _updateCategory = function(categoryModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(categoryModel),
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
				defer.resolve(response);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _deleteCategory = function(id) {
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

		categoryService.getCategories = _getCategories;
		categoryService.getCategory = _getCategory;
		categoryService.updateCategory = _updateCategory;
		categoryService.addCategory = _addCategory;
		categoryService.deleteCategory = _deleteCategory;

		return categoryService;
	}]);