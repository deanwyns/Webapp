'use strict';

/**
 * @ngdoc function
 * @name joetzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the joetzApp
 */
angular.module('joetzApp')
    .controller('MainCtrl', ['$state', '$scope', '$rootScope', '$mdDialog', 'userService', '$window', '$timeout',
        function($state, $scope, $rootScope, $mdDialog, userService, $window, $timeout) {
            var _isMobile = function() {
                if (document.querySelector('md-toolbar').offsetHeight === 64) {
                    return true;
                } else {
                    return false;
                }
            };

            $timeout(function() {
                $scope.$apply(function() {
                    $scope.isMobile = _isMobile();
                });
            });
            

            angular.element($window).bind('resize', function() {
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.isMobile = _isMobile();
                    });
                });
            });

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

            var _onUserLoggedIn = function(event, user) {
                $scope.user = user;
                if($state.is('register')) {
                    $state.go('home');
                }
            };

            var _onUserLoggedOut = function() {
                $scope.user = {};
                $state.go('home');
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

            $scope.openDialog = _openDialog;
            $scope.logout = _logout;

            $scope.$on('user:loggedIn', _onUserLoggedIn);
            $scope.$on('user:loggedOut', _onUserLoggedOut);
    }]);
