'use strict';

angular.module('joetzApp').controller('AdminRegistrationCtrl', ['$state', '$scope', 'registrationService', 'promiseTracker', '$mdDialog', function ($state, $scope, registrationService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};
    $scope.selectedRegistration = {};

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

    var _submitEdit = function(registrationModel) {
        if(!registrationModel) {
            return undefined;
        }

        registrationModel.street_name = registrationModel.facturation_address.street_name;
        registrationModel.postal_code = registrationModel.facturation_address.postal_code;
        registrationModel.city = registrationModel.facturation_address.city;
        registrationModel.house_number = registrationModel.facturation_address.house_number;

        var editPromise = registrationService.updateRegistration(registrationModel, registrationModel.id).then(function(response) {
            $scope.errors = {};
            _loadRegistrations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

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
            _loadRegistrations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    var _deleteRegistration = function(registrationModel) {
        var confirm = $mdDialog.confirm()
                    .title('Inschrijving verwijderen?')
                    .content('Weet je zeker dat je de inschrijving van ' + registrationModel.child_first_name + ' ' + registrationModel.child_last_name + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            registrationService.deleteRegistration(registrationModel.id).then(function() {
                _loadRegistrations();
            }, function(err) {
                console.log(err);
            });
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteCategory = _deleteRegistration;
  }]);