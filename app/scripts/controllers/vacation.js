'use strict';

angular.module('joetzApp')
	.controller('VacationCtrl', ['$scope', 'vacationService', 'categoryService', function($scope, vacationService, categoryService) {
		vacationService.getVacations().then(function(response) {
			var vacations = response;
			categoryService.getCategories().then(function(categories) {
				for(var vacation in vacations) {
					var categoryId = vacations[vacation].category_id;
					for(var category in categories) {
						if(categories[category].id === categoryId) {
							vacations[vacation].category_image = categories[category].photo_url;
							break;
						}
					}
				}

				$scope.vacations = vacations;
			});
		}, function(err) {
			console.log(err);
		});
	}]);