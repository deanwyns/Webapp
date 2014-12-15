'use strict';

angular.module('joetzApp').controller('AdminRegistrationCtrl', ['$state', '$scope', 'registrationService', 'promiseTracker', '$mdDialog', function ($state, $scope, registrationService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};
    $scope.selectedRegistration = {};

    /**
     * Laadt alle inschrijvingen en voegt ze toe aan de scope
     * @param  {boolean} transition Achterna terug naar lijst navigeren?
     * @return {void}            
     */
    var _loadRegistrations = function(transition) {
        registrationService.getRegistrations().then(function(registrations) {
            $scope.registrations = registrations;

            if(transition) {
                $state.go('admin.registration.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadRegistrations();

    /**
     * Past een inschrijving aan
     * @param  {object} registrationModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitEdit = function(registrationModel) {
        if(!registrationModel) {
            return undefined;
        }

        // Voegt adres-attributen toe aan het model, zodat de data correct wordt verstuurd
        registrationModel.street_name = registrationModel.facturation_address.street_name;
        registrationModel.postal_code = registrationModel.facturation_address.postal_code;
        registrationModel.city = registrationModel.facturation_address.city;
        registrationModel.house_number = registrationModel.facturation_address.house_number;

        var editPromise = registrationService.updateRegistration(registrationModel, registrationModel.id).then(function(response) {
            $scope.errors = {};
            // Laad de inschrijvingen opnieuw en navigeert naar de lijst
            _loadRegistrations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    /**
     * Voegt een nieuwe inschrijving toe
     * @param  {object} registrationModel    Een object met alle nodige attributen
     * @return {void}                  
     */
    var _submitNew = function(registrationModel) {
        if(!registrationModel) {
            return undefined;
        }

        registrationModel.street_name = registrationModel.facturation_address.street_name;
        registrationModel.postal_code = registrationModel.facturation_address.postal_code;
        registrationModel.city = registrationModel.facturation_address.city;
        registrationModel.house_number = registrationModel.facturation_address.house_number;

        var addPromise = registrationService.addRegistration(registrationModel).then(function(response) {
            $scope.errors = {};
            // Laad de categorieën opnieuw en navigeert naar de lijst
            _loadRegistrations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    /**
     * Verwijdert een inschrijving na bevestiging via dialoog
     * @param  {object} registrationModel Een object met alle nodige attributen
     * @return {void}               
     */
    var _deleteRegistration = function(registrationModel) {
        var confirm = $mdDialog.confirm()
                    .title('Inschrijving verwijderen?')
                    .content('Weet je zeker dat je de inschrijving van ' + registrationModel.child_first_name + ' ' + registrationModel.child_last_name + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            registrationService.deleteRegistration(registrationModel.id).then(function() {
                // Laad de categorieën opnieuw
                _loadRegistrations();
            }, function(err) {
                console.log(err);
            });
        });
    };

    // Voeg de methoden toe aan de scope
    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteCategory = _deleteRegistration;
  }]);