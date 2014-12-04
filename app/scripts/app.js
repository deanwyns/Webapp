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
    'ngQuickDate',
    'ngLocale',
    'permission'
  ])
  .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, ngQuickDateDefaultsProvider) {
    $locationProvider.html5Mode(true);
    
    ngQuickDateDefaultsProvider.set('parseDateFunction', function(str) {
      var seconds = Date.parse(str);
      var date = new Date(seconds);

      var year, month, day, hours, minutes;
      year = String(date.getFullYear());
      month = String(date.getMonth() + 1);
      if (month.length === 1) {
        month = '0' + month;
      }
      day = String(date.getDate());
      if (day.length === 1) {
        day = '0' + day;
      }
      hours = String(date.getHours());
      if (hours.length === 1) {
        hours = '0' + hours;
      }
      minutes = String(date.getMinutes());
      if (minutes.length === 1) {
        minutes = '0' + minutes;
      }

      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    });

    //$httpProvider.interceptors.push('authInterceptorService');
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post.Accept = 'application/vnd.joetz.v1+json';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';


    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('menu', {
        url: '/',
        templateUrl: 'views/menu.html',
        //controller: 'MenuCtrl',
        data: {
          pageTitle: 'Joetz'
        }
      })
      .state('news', {
        url: '/nieuws',
        templateUrl: 'views/main.html',
        data: {
          pageTitle: 'Nieuwsoverzicht',
          back: {
            button: 'Menu',
            state: 'login'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          pageTitle: 'Inloggen',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('vacations', {
        url: '/vakanties',
        template: '<ui-view />',
        controller: 'VacationCtrl',
      })
      .state('vacations.list', {
        url: '/',
        templateUrl: 'views/vacations.html',
        data: {
          pageTitle: 'Vakantieoverzicht',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('vacations.detail', {
        url: '/:vacationId/details', 
        templateUrl: 'views/vacation-detail.html', 
        controller: function($scope, vacationService, $stateParams){
          var vacationId = $stateParams.vacationId;
          vacationService.getVacation(vacationId).then(function(vacation){
            $scope.selectedVacation = vacation;
          });
        }
      })
      .state('vacations.register', {
        url: '/:vacationId/inschrijven',
        templateUrl: 'views/vacation/register.html',
        controller: 'RegistrationCtrl'
      })
      .state('vacations.register.child-selection', {
        url: '/kinderen', 
        templateUrl: 'views/vacation/children.html',
        data: {
          pageTitle: 'Kinderen',
          back: {
            button: 'Vakantie',
            state: 'vacations'
          }
        }
      })
      .state('vacations.register.register-information', {
        url: '/informatie', 
        templateUrl: 'views/vacation/information.html',
        data: {
          pageTitle: 'Inschrijving',
          back: {
            button: 'Kinderen',
            state: 'vacations.register.child-selection'
          }
        }
      })
      .state('vacations.register.summary', {
        url: '/overzicht', 
        templateUrl: 'views/vacation/summary.html',
        data: {
          pageTitle: 'Bevestiging',
          back: {
            button: 'Inschrijving',
            state: 'vacations.register.register-information'
          }
        }
      })
      .state('register', {
        url: '/registreer',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        data: {
          permissions: {
            only: ['anonymous']
          },
          pageTitle: 'Registreren',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('profile', {
        abstract: true,
        url: '/profile',
        template: '<ui-view />',
        controller: 'UserCtrl'
      })
      .state('profile.overview', {
        url: '/',
        templateUrl: 'views/user/profile.html',
        data: {
          pageTitle: 'Profiel',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('profile.add-child', {
        url: '/kind/toevoegen',
        templateUrl: 'views/user/child-edit.html',
        data: {
          pageTitle: 'Kind toevoegen',
          back: {
            button: 'Profiel',
            state: 'profile'
          }
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin/main.html',
        controller: 'AdminCtrl',
        data: {
          permissions: {
            only: ['admin']
          },
          pageTitle: 'Admin',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('admin.user', {
        abstract: true,
        url: '/gebruikers',
        template: '<ui-view />',
        controller: 'AdminUserCtrl'
      })
      .state('admin.user.list', {
        url: '/',
        templateUrl: 'views/admin/user.html',
        data: {
          pageTitle: 'Gebruikers beheren',
          back: {
            button: 'Menu',
            state: 'menu'
          }
        }
      })
      .state('admin.user.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/user-edit.html',
        data: {
          pageTitle: 'Gebruiker aanmaken',
          back: {
            button: 'Lijst',
            state: 'admin.user.list'
          }
        }
      })
      .state('admin.user.edit', {
        url: '/:userId/wijzig',
        templateUrl: 'views/admin/user-edit.html',
        controller: function($scope, userService, $stateParams) {
          var userId = $stateParams.userId;
          userService.getUser(userId).then(function(user) {
            $scope.selectedUser = user;
          }, function(err) {
            console.log(err);
          });
        },
        data: {
          pageTitle: 'Gebruiker wijzigen',
          back: {
            button: 'Lijst',
            state: 'admin.user.list'
          }
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
        templateUrl: 'views/admin/vacation.html',
        data: {
          pageTitle: 'Vakanties beheren',
          back: {
            button: 'Lijst',
            state: 'admin.vacation.list'
          }
        }
      })
      .state('admin.vacation.detail', {
        url: '/:vacationId',
        templateUrl: 'views/admin/vacation-detail.html'
      })
      .state('admin.vacation.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/vacation-edit.html',
        data: {
          pageTitle: 'Vakantie aanmaken',
          back: {
            button: 'Lijst',
            state: 'admin.vacation.list'
          }
        }
      })
      .state('admin.vacation.edit', {
        url: '/:vacationId/wijzig',
        templateUrl: 'views/admin/vacation-edit.html',
        controller: function($scope, vacationService, $stateParams) {
          var vacationId = $stateParams.vacationId;
          vacationService.getVacation(vacationId).then(function(vacation) {
            $scope.selectedVacation = vacation;
          });
        },
        data: {
          pageTitle: 'Vakantie wijzigen',
          back: {
            button: 'Lijst',
            state: 'admin.vacation.list'
          }
        }
      });
  })
  .run(function (Permission, userService, $rootScope, $location, $timeout, $window, $state) {
    //$rootScope.$state = $state;
    //$rootScope.$stateParams = $stateParams;
    $rootScope.previousState = {};
    $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState.name = fromState.name;
        $rootScope.previousState.params = fromParams;
    });

    $rootScope.back = function() {
        $state.go($rootScope.previousState.name, $rootScope.previousState.params);
    };

    Permission
      .defineRole('anonymous', function() {
        return !userService.isAuthenticated();
      })
      .defineRole('parents', function() {
        return userService.getType() === 'parents' && userService.isAuthenticated();
      })
      .defineRole('monitor', function() {
        return userService.getType() === 'monitor' && userService.isAuthenticated();
      })
      .defineRole('admin', function() {
        return userService.getType() === 'admin' && userService.isAuthenticated();
      });

      var _isMobile = function() {
          if (document.querySelector('md-toolbar').offsetHeight === 64) {
              return true;
          } else {
              return false;
          }
      };

      $timeout(function() {
          $rootScope.$apply(function() {
              $rootScope.isMobile = _isMobile();
          });
      });

      angular.element($window).bind('resize', function() {
          $timeout(function() {
              $rootScope.$apply(function() {
                  $rootScope.isMobile = _isMobile();
              });
          });
      });

      if(!_isMobile()) {
        $location.path('nieuws');
      }
  });
