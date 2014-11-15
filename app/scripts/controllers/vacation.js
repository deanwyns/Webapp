'use strict';

angular.module('joetzApp')
	.controller('VacationCtrl', ['$scope', 'vacationService' ,function($scope, vacationService) {
		vacationService.getVacations().then(function(vacations) {
			$scope.vacations = vacations;
		}, function(err) {
			$scope.vacations = err;
		});



	}]);