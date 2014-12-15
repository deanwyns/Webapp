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
            /**
             * Wordt opgeroepen als de gebruiker ingelogd is (broadcast of emit)
             * Voegt de ingelogde gebruiker toe aan de scope
             * @param  {object} event 
             * @param  {object} user  
             * @return {void}       
             */
            var _onUserLoggedIn = function(event, user) {
                $scope.user = user;
            };

            /**
             * Wordt opgeroepen als de gebruiker uitgelogd wordt (broadcast of emit)
             * Verwijdert de gebruiker van de scope en navigeert naar het menu
             * @return {void} 
             */
            var _onUserLoggedOut = function() {
                $scope.user = {};
                $state.go('menu');
            };

            /**
             * Opent het login-dialoogvenster
             * @param  {object} $event 
             * @return {void}        
             */
            var _openDialog = function($event) {
                // Opent een dialoogvenster vanaf het meegegeven event en
                // bij bevestiging (en na een login-request te sturen) wordt
                // een broadcast uitgezonden.
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

            /**
             * Logt de gebruiker uit
             * @return {void} 
             */
            var _logout = function() {
                userService.logout();

                // Stuur een broadcast
                $timeout(function() {
                    $scope.$broadcast('user:loggedOut');
                });
            };

            /**
             * Wordt opgeroepen bij een verandering van route
             * @param  {object} event   
             * @param  {object} toState 
             * @return {void}         
             */
            var _onRouteChangeSuccess = function(event, toState) {
                // Als de paginatitel van een state is gedefinieerd,
                // wordt hij toegevoegd aan de scope
                if(angular.isDefined(toState.data.pageTitle)) {
                    $scope.pageTitle = toState.data.pageTitle;
                }
            };

            // Voeg de methoden toe aan de scope
            $scope.openDialog = _openDialog;
            $scope.logout = _logout;

            // Initialeer de listeners
            $scope.$on('user:loggedIn', _onUserLoggedIn);
            $scope.$on('user:loggedOut', _onUserLoggedOut);
            $scope.$on('$stateChangeSuccess', _onRouteChangeSuccess);

            // Zorgt ervoor dat iemand die ingelogd was en de browser heeft
            // gesloten weer wordt ingelogd.
            userService.init().then(function(user) {
                if (user.isAuth) {
                    $timeout(function() {
                        $scope.$broadcast('user:loggedIn', user);
                    });
                }

                // Zorgt ervoor dat het laadscherm (tot als de gebruiker weer is ingelogd)
                // verdwijnt.
                // Het laadscherm is verwijderd wegens problemen. Gebruikt nu enkel ngCloak
                $timeout(function() {
                    $rootScope.$broadcast('loading:done');
                });
            }, function() {
                // Als de login mislukt het laadscherm ook doen verdwijnen
                $timeout(function() {
                    $rootScope.$broadcast('loading:done');
                });
            });
    }]);
