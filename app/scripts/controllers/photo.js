'use strict';

angular.module('joetzApp').controller('PhotoCtrl', ['$scope', 'vacationService', function ($scope, vacationService) {
	var _getPhotosByVacation = function(vacationId) {
		console.log(vacationId);
		vacationService.getPhotos(vacationId).then(function(photos) {
	        $scope.photos[vacationId] = photos;
	    });
	};

	for(var child in $scope.user.children) {
		for(var registration in child.registrations) {
			_getPhotosByVacation(registration.vacationId);
		}
	}
  }]);