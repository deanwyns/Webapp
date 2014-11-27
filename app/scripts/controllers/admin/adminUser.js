'use strict';

angular.module('joetzApp').controller('AdminUserCtrl', ['$state', '$scope', 'userService', 'promiseTracker', '$mdDialog', function ($state, $scope, userService, promiseTracker, $mdDialog) {
    $scope.editTracker = promiseTracker();
    $scope.errors = {};

    var _loadUsers = function(transition) {
        userService.getUsers().then(function(users) {
            $scope.users = users;

            if(transition) {
                $state.go('admin.user.list');
            }
        }, function(err) {
            console.log(err);
        });
    };
    _loadUsers();

    var _submitEdit = function(userModel) {
        if(!userModel) {
            return undefined;
        }

        var editPromise = userService.update(userModel, userModel.id).then(function(response) {
            console.log(response);
            _loadUsers(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNew = function(userModel, userType) {
        if(!userModel) {
            return undefined;
        }

        switch(userType) {
            case 'parents':
                var addPromise = userService.register(userModel).then(function(response) {
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors) {
                        $scope.errors[key] = err.errors[key][0];
                    }
                });
                break;
            case 'monitor':
                var addPromise = userService.registerMonitor(userModel).then(function(response) {
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors) {
                        $scope.errors[key] = err.errors[key][0];
                    }
                });
                break;
            case 'admin':
                var addPromise = userService.registerAdmin(userModel).then(function(response) {
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors) {
                        $scope.errors[key] = err.errors[key][0];
                    }
                });
                break;
        }

        

        $scope.editTracker.addPromise(addPromise);
    }

    var _deleteUser = function(userModel) {
        var confirm = $mdDialog.confirm()
                    .title(userModel.email + ' verwijderen?')
                    .content('Weet je zeker dat je ' + userModel.email + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            userService.deleteUser(userModel.id).then(function() {
                console.log('Gelukt');
            }, function() {
                console.log('Mislukt');
            });
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteUser = _deleteUser;
  }]);