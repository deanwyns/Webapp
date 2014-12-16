'use strict';

angular.module('joetzApp').controller('RegistrationCtrl', ['$scope', '$state', '$stateParams', 'userService', 'vacationService', '$mdToast', function ($scope, $state, $stateParams, userService, vacationService, $mdToast) {
    // Haalt de vakantie-id uit de URL en voegt die toe aan het inschrijvingsmodel in de scope
    var vacationId = $stateParams.vacationId;
    $scope.registration = {
    	vacation_id: vacationId
    };

    // Haalt de geselecteerde vakantie op en voegt die toe aan de scope
    vacationService.getVacation(vacationId).then(function(vacation) {
        $scope.selectedVacation = vacation;
    });

    $scope.errors = {};

    /**
     * Wordt opgeroepen bij het navigeren van de kindselectie naar
     * bijkomende inschrijvingsinformatie.
     * @return {void} 
     */
    var _selectChild = function() {
        // Als er een kind is geselecteerd, het geselecteerde kind toevoegen aan de scope
        // en navigeren naar de volgende sectie
    	if($scope.registration.selectedChildIndex) {
    		$scope.registration.selectedChild = $scope.user.children[$scope.registration.selectedChildIndex];
    		$state.go('vacations.register.register-information');
    	}
    };

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.facturation_first_name.$error.required', function(validity) {
        if(!validity) {
            delete $scope.errors.facturation_first_name;
        } else {
            $scope.errors.facturation_first_name = 'Het veld \'Voornaam\' is verplicht';
        }
    });

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.facturation_last_name.$error.required', function(validity) {
        if(!validity) {
            delete $scope.errors.facturation_last_name;
        } else {
            $scope.errors.facturation_last_name = 'Het veld \'Naam\' is verplicht';
        }
    });

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.street_name.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.street_name;
    	} else {
    		$scope.errors.street_name = 'Het veld \'Straat\' is verplicht';
    	}
    });

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.house_number.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.house_number;
    	} else {
    		$scope.errors.house_number = 'Het veld \'Huisnummer\' is verplicht';
    	}
    });

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.city.$error.required', function(validity) {
    	if(!validity) {
    		delete $scope.errors.city;
    	} else {
    		$scope.errors.city = 'Het veld \'Gemeente\' is verplicht';
    	}
    });

    /** Bekijkt of het veld correct is ingevuld en voegt eventueel een foutmelding toe aan de scope */
    $scope.$watch('vacation_registration_form.postal_code.$error.pattern', function(validity) {
    	if(!validity) {
    		delete $scope.errors.postal_code;
    	} else {
    		$scope.errors.postal_code = 'Het veld \'Postcode\' is geen geldige postcode.';
    	}
    });

    /**
     * Wordt opgeroepen bij het navigeren van de inschrijvingsinformatie naar de samenvatting
     * @return {void} 
     */
    var _registerInformation = function() {
        // Als het formulier correct is ingevuld
    	if($scope.vacation_registration_form.$valid) {
            // Navigeer naar de samenvatting
    		$state.go('vacations.register.summary');
    	}
    };

    /**
     * Wordt opgeroepen als de samenvatting bevestigd is
     * @return {void}
     */
    var _saveRegistration = function() {
    	userService.saveRegistration($scope.registration, $scope.registration.selectedChild.id).then(function() {
            // Notificeer de gebruiker
            $state.go('vacations.detail', { vacationId: $scope.registration.vacation_id });
            $mdToast.show($mdToast.simple().content('Je hebt je succesvol ingeschreven. Gelieve de betaling te voltooien.'));
    	}, function(err) {
            console.log(err);
    	});
    };

    // Voegt de methoden toe aan de scope
    $scope.selectChild = _selectChild;
    $scope.registerInformation = _registerInformation;
    $scope.saveRegistration = _saveRegistration;
  }]);