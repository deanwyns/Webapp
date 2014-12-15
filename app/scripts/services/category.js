'use strict';

angular.module('joetzApp')
	.factory('categoryService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/category',
			categoryService = {};

		/** GET-request om alle categorieën te laden */
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

		/** GET-request om een specifieke categorie te laden adhv zijn id */
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

		/**
		 * POST-request om een categorie toe te voegen
		 * @param {object} categoryModel Een object met alle nodige attributen
		 * @return {object} 			 De promise voor deze request
		 */
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

		/**
		 * PUT-request om een bepaalde categorie up te daten
		 * @param  {object} categoryModel Een object met de nodige attributen
		 * @param  {int} id            De id van de categorie die je wenst up te daten
		 * @return {object}               De promise voor deze request
		 */
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

		/**
		 * DELETE-request om een bepaalde categorie te verwijderen
		 * @param  {int} id De id van de categorie die je wenst te verwijderen
		 * @return {object}    De promise van deze requeest
		 */
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

		// Voeg de methoden toe aan het object
		categoryService.getCategories = _getCategories;
		categoryService.getCategory = _getCategory;
		categoryService.updateCategory = _updateCategory;
		categoryService.addCategory = _addCategory;
		categoryService.deleteCategory = _deleteCategory;

		// Return het object
		return categoryService;
	}]);