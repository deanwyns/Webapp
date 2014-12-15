'use strict';

angular.module('joetzApp').controller('AdminUserCtrl', ['$state', '$scope', 'userService', 'dateService', 'promiseTracker', '$mdDialog', function ($state, $scope, userService, dateService, promiseTracker, $mdDialog) {
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

    var _submitEditChild = function(childModel) {
        if(!childModel) {
            return undefined;
        }

        childModel.street_name = childModel.address.street_name;
        childModel.postal_code = childModel.address.postal_code;
        childModel.city = childModel.address.city;
        childModel.house_number = childModel.address.house_number;
        childModel.date_of_birth = dateService.dateToMySQLString(childModel.date_of_birth_d);

        var editPromise = userService.updateChild(childModel, childModel.id).then(function(response) {
            $scope.errors = {};
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNewChild = function(childModel) {
        if(!childModel) {
            return undefined;
        }

        childModel.street_name = childModel.address.street_name;
        childModel.postal_code = childModel.address.postal_code;
        childModel.city = childModel.address.city;
        childModel.house_number = childModel.address.house_number;
        childModel.date_of_birth = dateService.dateToMySQLString(childModel.date_of_birth_d);

        var addPromise = userService.addChild(childModel).then(function(response) {
            $scope.errors = {};
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    var _submitEdit = function(userModel) {
        if(!userModel) {
            return undefined;
        }

        var editPromise = userService.update(userModel, userModel.id).then(function(response) {
            $scope.errors = {};

            _loadUsers(true);
        }, function(err) {
            for(var key in err.errors.messages) {
                $scope.errors[key] = err.errors.messages[key][0];
            }
        });

        $scope.editTracker.addPromise(editPromise);
    };

    var _submitNew = function(userModel) {
        if(!userModel || !userModel.type) {
            return undefined;
        }

        switch(userModel.type) {
            case 'parents':
                var addPromise = userService.register(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
            case 'monitor':
                var addPromise = userService.registerMonitor(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
            case 'admin':
                var addPromise = userService.registerAdmin(userModel).then(function(response) {
                    $scope.errors = {};
                    _loadUsers(true);
                }, function(err) {
                    for(var key in err.errors.messages) {
                        $scope.errors[key] = err.errors.messages[key][0];
                    }
                });

                $scope.editTracker.addPromise(addPromise);
                break;
        }
    }

    var _deleteUser = function(userModel) {
        var confirm = $mdDialog.confirm()
                    .title(userModel.email + ' verwijderen?')
                    .content('Weet je zeker dat je ' + userModel.email + ' wilt verwijderen?')
                    .ok('Ja, ik weet het zeker.')
                    .cancel('Nee, annuleer.');
        $mdDialog.show(confirm).then(function() {
            userService.deleteUser(userModel.id).then(function() {
                _loadUsers();
            }, function() {
                console.log('Mislukt');
            });
        });
    };

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
    $scope.deleteUser = _deleteUser;

    $scope.submitEditChild = _submitEditChild;
    $scope.submitNewChild = _submitNewChild;
  }]);