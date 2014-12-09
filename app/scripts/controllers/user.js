'use strict';

angular.module('joetzApp').controller('UserCtrl', ['$state', '$scope', 'userService', 'promiseTracker', '$mdDialog', function ($state, $scope, userService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};

    var _loadProfile = function(transition) {
        userService.getProfile().then(function() {
            $scope.user = userService.getLocalUser();

            if(transition) {
                //$state.go('profile.overview');
                $state.back();
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadProfile();

    var _submitEdit = function(childModel) {
        if(!childModel) {
            return undefined;
        }

        var editPromise = userService.updateChild(childModel, childModel.id).then(function() {
            $scope.errors = {};

            _loadProfile(true);
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNew = function(childModel) {
        console.log(childModel);
        if(!childModel) {
            return undefined;
        }

        var addPromise = userService.addChild(childModel).then(function() {
            $scope.errors = {};
            _loadProfile(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    };

    var _deleteChild = function(childModel) {
        var confirm = $mdDialog.confirm()
                    .title(childModel.email + ' verwijderen?')
                    .content('Weet je zeker dat je ' + childModel.email + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            userService.deleteUser(childModel.id).then(function() {
                _loadProfile();
            }, function() {
                console.log('Mislukt');
            });
        });
    };

    var _changePassword = function(newPassword, newPasswordConfirmed) {
        userService.update({ password: newPassword, password_confirmed: newPasswordConfirmed }, userService.getLocalUser().id).then(function() {
            $scope.message = 'Uw wachtwoord is gewijzigd.';
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteChild = _deleteChild;
    $scope.changePassword = _changePassword;
  }]);