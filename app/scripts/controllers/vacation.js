'use strict';

angular.module('joetzApp')
	.controller('VacationCtrl', ['$scope', 'vacationService', function($scope, vacationService) {
		// Laadt alle vakanties en voegt ze toe aan de scope
		vacationService.getVacations().then(function(vacations) {
			$scope.vacations = vacations;
		}, function(err) {
			console.log(err);
		});
	}]);