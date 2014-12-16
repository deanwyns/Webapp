'use strict';

angular.module('joetzApp').controller('PhotoCtrl', ['$scope', 'vacationService', '$mdDialog', function ($scope, vacationService, $mdDialog) {
	$scope.photos = [];

	var _getPhotosByVacation = function(vacationId) {
		console.log(vacationId);
		if(!(vacationId in $scope.photos)) {
			vacationService.getPhotos(vacationId).then(function(photos) {
		        $scope.photos[vacationId] = photos;
		    });
		}
	};

	var _showPhoto = function(ev, fullsize) {
	    $mdDialog.show({
	      template: '<img src="' + fullsize + '"> />',
	      targetEvent: ev
	    });
	};

	$scope.getPhotosByVacation = _getPhotosByVacation;
	$scope.showPhoto = _showPhoto;
  }]);