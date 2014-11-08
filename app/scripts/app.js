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
    'ajoslin.promise-tracker'
  ])
  .config(function ($httpProvider, $routeProvider) {
    //$httpProvider.interceptors.push('authInterceptorService');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post.Accept = 'application/vnd.joetz.v1+json';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/menu', {
        templateUrl: 'views/menu.html',
        controller: 'MenuCtrl'
      })
      .when('/vakanties', {
        templateUrl: 'views/vacations.html',
        controller: 'VacationCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function() {
    angular.element(document.querySelector('loading-screen')).attr('loading', '');
  });
