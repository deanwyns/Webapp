'use strict';

angular.module('joetzApp').controller('AdminVacationCtrl', ['$state', '$scope', 'vacationService', 'promiseTracker', '$mdDialog', function ($state, $scope, vacationService, promiseTracker, $mdDialog) {
    $scope.selectedIndex = 0;
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

        var vacationId = vacationModel.id;
        var tmpModel = vacationModel;
        delete tmpModel.id;

        var editPromise = vacationService.updateVacation(tmpModel, vacationId).then(function(response) {
            console.log(response);
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
            console.log(response);
            _loadVacations(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });
    }

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
  }]);