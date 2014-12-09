'use strict';

angular.module('joetzApp').controller('RegistrationCtrl', ['$scope', '$state', '$stateParams', 'userService', function ($scope, $state, $stateParams, userService) {
	var vacationId = $stateParams.vacationId;
    $scope.registration = {
    	vacation_id: vacationId
    };

    $scope.errors = {};

    var _selectChild = function() {
    	if($scope.registration.selectedChildIndex) {
    		$scope.registration.selectedChild = $scope.user.children[$scope.registration.selectedChildIndex];
    		$state.go('vacations.register.register-information');
    	}
    };

    $scope.$watch('vacation_registration_form.streetName.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.streetName;
    	} else {
    		$scope.errors.streetName = 'Het veld \'Straat\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.houseNumber.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.houseNumber;
    	} else {
    		$scope.errors.houseNumber = 'Het veld \'Huisnummer\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.city.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.city;
    	} else {
    		$scope.errors.city = 'Het veld \'Gemeente\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.postalCode.$error.pattern', function(validity) {
    	if(!validity) {
    		delete $scope.errors.postalCode;
    	} else {
    		$scope.errors.postalCode = 'Het veld \'Postcode\' is geen geldige postcode.';
    	}
    });

    var _registerInformation = function() {
    	if($scope.vacation_registration_form.$valid) {
    		$state.go('vacations.register.summary');
    	}
    };

    var _saveRegistration = function() {
    	userService.saveRegistration($scope.registration).then(function() {

    	}, function() {

    	});
    };

    $scope.selectChild = _selectChild;
    $scope.registerInformation = _registerInformation;
    $scope.saveRegistration = _saveRegistration;
  }]);