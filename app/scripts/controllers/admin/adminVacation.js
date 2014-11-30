'use strict';

angular.module('joetzApp').controller('AdminVacationCtrl', ['$state', '$scope', 'vacationService', 'promiseTracker', '$mdDialog', function ($state, $scope, vacationService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};

    var _loadVacations = function(transition) {
        vacationService.getVacations().then(function(vacations) {
            $scope.vacations = vacations;
            console.log(vacations);

            if(transition) {
                $state.go('admin.vacation.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadVacations();

    var _submitEdit = function(vacationModel) {
        if(!vacationModel) {
            return undefined;
        }

        var editPromise = vacationService.updateVacation(vacationModel, vacationModel.id).then(function(response) {
            $scope.errors = {};
            _loadVacations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNew = function(vacationModel) {
        if(!vacationModel) {
            return undefined;
        }

        var addPromise = vacationService.addVacation(vacationModel).then(function(response) {
            $scope.errors = {};
            _loadVacations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    var _deleteVacation = function(vacationModel) {
        var confirm = $mdDialog.confirm()
                    .title(vacationModel.title + ' verwijderen?')
                    .content('Weet je zeker dat je ' + vacationModel.title + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            vacationService.deleteVacation(vacationModel.id).then(function() {
                _loadVacations();
            }, function(err) {
                console.log(err);
            });
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteVacation = _deleteVacation;
  }]);