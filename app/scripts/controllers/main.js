'use strict';

/**
 * @ngdoc function
 * @name joetzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the joetzApp
 */
angular.module('joetzApp')
    .controller('MainCtrl', ['$state', '$scope', '$rootScope', '$mdDialog', 'userService', '$timeout',
        function($state, $scope, $rootScope, $mdDialog, userService, $timeout) {
            var _onUserLoggedIn = function(event, user) {
                $scope.user = user;
            };

            var _onUserLoggedOut = function() {
                $scope.user = {};
                $state.go('menu');
            };

            var _openDialog = function($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    controller: 'LoginDialogCtrl',
                    templateUrl: 'views/loginDialog.html'
                }).then(function(user) {
                    $timeout(function() {
                        $scope.$broadcast('user:loggedIn', user);
                    });
                }, function() {
                    //Cancelled
                });
            };

            var _logout = function() {
                userService.logout();

                $timeout(function() {
                    $scope.$broadcast('user:loggedOut');
                });
            };

            var _onRouteChangeSuccess = function(event, toState) {
                if(angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle;
                }
                
                $scope.back = toState.data.back;
            };

            $scope.openDialog = _openDialog;
            $scope.logout = _logout;

            $scope.$on('user:loggedIn', _onUserLoggedIn);
            $scope.$on('user:loggedOut', _onUserLoggedOut);
            $scope.$on('$stateChangeSuccess', _onRouteChangeSuccess);

            userService.init().then(function(user) {
                if (user.isAuth) {
                    $timeout(function() {
                        $scope.$broadcast('user:loggedIn', user);
                    });
                }

                $timeout(function() {
                    $rootScope.$broadcast('loading:done');
                });
            }, function() {
                $timeout(function() {
                    $rootScope.$broadcast('loading:done');
                });
            });
    }]);
