'use strict';

angular.module('joetzApp')
	.factory('vacationService', ['$http', '$q', 'queryBuilder', 'userService', function($http, $q, queryBuilder, userService) {
		var baseUrl = 'http://lloyd.deanwyns.me/api/vacation/',
			vacationService = {};

		var _getVacations = function() {
			var defer = $q.defer();

			$http({
				method: 'GET',
				url: baseUrl
			}).success(function(response) {
				defer.resolve(response.vacations);
			}).error(function(err) {
				defer.reject(err);
			});

			return defer.promise;
		};

		var _addVacation = function(vacationModel) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
				headers = {};
				/*data = 	'title=' + vacationModel.title +
						'&description=' + vacationModel.description +
						'&promoText=' + vacationModel.promoText +
						'&location=' + vacationModel.location +
						'&ageFrom=' + vacationModel.ageFrom +
						'&ageTo=' + vacationModel.ageTo +
						'&transportation=' + vacationModel.transportation +
						'&maxParticipants=' + vacationModel.maxParticipants +
						'&baseCost=' + vacationModel.baseCost +
						'&oneBmMemberCost=' + vacationModel.oneBmMemberCost +
						'&twoBmMemberCost=' + vacationModel.twoBmMemberCost +
						'&taxDeductable=' + vacationModel.taxDeductable +
						'&beginDate=' + vacationModel.beginDate +
						'&endDate=' + vacationModel.endDate;*/

			if(!userService.isAuthenticated()) {
				defer.reject();
				return defer;
			}

			headers.Authorization = userService.getToken();

			$http({
				method: 'POST',
				url: baseUrl,
				data: data,
				headers: headers
			}).success(function(response) {
				console.log(response);
				defer.resolve(response);
			}).error(function(err) {
				console.log(err);
				defer.reject(err);
			});

			return defer;
		};

		var _updateVacation = function(vacationModel, id) {
			var defer = $q.defer(),
				data = queryBuilder.build(vacationModel),
				headers = {};
				/*data = 	'title=' + vacationModel.title +
						'&description=' + vacationModel.description +
						'&promoText=' + vacationModel.promoText +
						'&location=' + vacationModel.location +
						'&ageFrom=' + vacationModel.ageFrom +
						'&ageTo=' + vacationModel.ageTo +
						'&transportation=' + vacationModel.transportation +
						'&maxParticipants=' + vacationModel.maxParticipants +
						'&baseCost=' + vacationModel.baseCost +
						'&oneBmMemberCost=' + vacationModel.oneBmMemberCost +
						'&twoBmMemberCost=' + vacationModel.twoBmMemberCost +
						'&taxDeductable=' + vacationModel.taxDeductable +
						'&beginDate=' + vacationModel.beginDate +
						'&endDate=' + vacationModel.endDate;*/

			if(!userService.isAuthenticated()) {
				defer.reject();
				return defer;
			}

			headers.Authorization = userService.getToken();

			$http({
				method: 'PUT',
				url: baseUrl + '/' + id,
				data: data,
				headers: headers
			}).success(function(response) {
				console.log(response);
				defer.resolve(response);
			}).error(function(err) {
				console.log(err);
				defer.reject(err);
			});

			return defer;
		};

		var _deleteVacation = function(id) {
			var defer = $q.defer(),
				headers = {};

			if(!userService.isAuthenticated()) {
				defer.reject();
				return defer;
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

		vacationService.getVacations = _getVacations;
		vacationService.updateVacation = _updateVacation;
		vacationService.addVacation = _addVacation;
		vacationService.deleteVacation = _deleteVacation;

		return vacationService;
	}]);