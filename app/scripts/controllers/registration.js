'use strict';

angular.module('joetzApp').controller('RegistrationCtrl', ['$scope', '$state', '$stateParams', 'userService', 'vacationService', function ($scope, $state, $stateParams, userService, vacationService) {
	console.log('invoke RegkfkfController with $state', $state);
    var vacationId = $stateParams.vacationId;
    $scope.registration = {
    	vacation_id: vacationId
    };

    vacationService.getVacation(vacationId).then(function(vacation) {
        $scope.selectedVacation = vacation;
    });

    $scope.errors = {};

    var _selectChild = function() {
    	if($scope.registration.selectedChildIndex) {
    		$scope.registration.selectedChild = $scope.user.children[$scope.registration.selectedChildIndex];
    		$state.go('vacations.register.register-information');
    	}
    };

    $scope.$watch('vacation_registration_form.facturation_first_name.$error.required', function(validity) {
        if(!validity) {
            delete $scope.errors.facturation_first_name;
        } else {
            $scope.errors.facturation_first_name = 'Het veld \'Voornaam\' is verplicht';
        }
    });

    $scope.$watch('vacation_registration_form.facturation_last_name.$error.required', function(validity) {
        if(!validity) {
            delete $scope.errors.facturation_last_name;
        } else {
            $scope.errors.facturation_last_name = 'Het veld \'Naam\' is verplicht';
        }
    });

    $scope.$watch('vacation_registration_form.street_name.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.street_name;
    	} else {
    		$scope.errors.street_name = 'Het veld \'Straat\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.house_number.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.house_number;
    	} else {
    		$scope.errors.house_number = 'Het veld \'Huisnummer\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.city.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.city;
    	} else {
    		$scope.errors.city = 'Het veld \'Gemeente\' is verplicht';
    	}
    });

    $scope.$watch('vacation_registration_form.postal_code.$error.pattern', function(validity) {
    	if(!validity) {
    		delete $scope.errors.postal_code;
    	} else {
    		$scope.errors.postal_code = 'Het veld \'Postcode\' is geen geldige postcode.';
    	}
    });

    var _registerInformation = function() {
    	if($scope.vacation_registration_form.$valid) {
    		$state.go('vacations.register.summary');
    	}
    };

    var _saveRegistration = function() {
        console.log($scope.registration);
    	userService.saveRegistration($scope.registration, $scope.registration.selectedChild.id).then(function(response) {
            console.log(response);
    	}, function(err) {
            console.log(err);
    	});
    };

    $scope.selectChild = _selectChild;
    $scope.registerInformation = _registerInformation;
    $scope.saveRegistration = _saveRegistration;
  }]);