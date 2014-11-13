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

    var _submitNew = function(userModel) {
        if(!userModel) {
            return undefined;
        }

        var addPromise = userService.register(userModel).then(function(response) {
            console.log(response);
            _loadUsers(true);
        }, function(err) {
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
        });

        $scope.editTracker.addPromise(addPromise);
    }

    $scope.submitEdit = _submitEdit;
    $scope.submitNew = _submitNew;
  }]);