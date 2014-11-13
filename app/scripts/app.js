'use strict';

/**
 * @ngdoc overview
 * @name joetzApp
 * @description
 * # joetzApp
 *
 * Main module of the application.
 */
angular
  .module('joetzApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'LocalStorageModule',
    'ajoslin.promise-tracker',
    'ui.router',
    'ngQuickDate'
  ])
  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {
    //$httpProvider.interceptors.push('authInterceptorService');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post.Accept = 'application/vnd.joetz.v1+json';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('vacations', {
        url: '/vakanties',
        templateUrl: 'views/vacations.html',
        controller: 'VacationCtrl'
      })
      .state('register', {
        url: '/registreer',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl'
      })
      .state('admin.user', {
        abstract: true,
        url: '/gebruikers',
        template: '<ui-view />',
        controller: 'AdminUserCtrl'
      })
      .state('admin.user.list', {
        url: '/',
        templateUrl: 'views/admin/user.html'
      })
      .state('admin.user.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/user-edit.html'
      })
      .state('admin.user.edit', {
        url: '/:userId/wijzig',
        templateUrl: 'views/admin/user-edit.html',
        controller: function($scope, userService, $stateParams) {
          var userId = $stateParams.userId;
          userService.getUser(userId).then(function(user) {
            console.log(user);
            $scope.selectedUser = user;
          }, function(err) {
            console.log(err);
          });
        }
      })
      .state('admin.vacation', {
        abstract: true,
        url: '/vakanties',
        template: '<ui-view />',
        controller: 'AdminVacationCtrl'
      })
      .state('admin.vacation.list', {
        url: '/',
        templateUrl: 'views/admin/vacation.html'
      })
      .state('admin.vacation.detail', {
        url: '/:vacationId',
        templateUrl: 'views/admin/vacation-detail.html'
      })
      .state('admin.vacation.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/vacation-edit.html'
      })
      .state('admin.vacation.edit', {
        url: '/:vacationId/wijzig',
        templateUrl: 'views/admin/vacation-edit.html',
        controller: function($scope, vacationService, $stateParams) {
          var vacationId = $stateParams.vacationId;
          vacationService.getVacation(vacationId).then(function(vacation) {
            $scope.selectedVacation = vacation;
          });
        }
      });
  });
