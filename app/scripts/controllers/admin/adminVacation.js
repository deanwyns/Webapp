'use strict';

angular.module('joetzApp').controller('AdminVacationCtrl', ['$state', '$scope', 'vacationService', 'promiseTracker', function ($state, $scope, vacationService, promiseTracker) {
    $scope.selectedIndex = 0;
    $scope.editTracker = promiseTracker();

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
            console.log(err);
        });

        $scope.editTracker.addPromise(editPromise);
    };

    $scope.submitEdit = _submitEdit;
  }]);