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
    'ngLocale',
    'permission',
    'akoenig.deckgrid',
    'ngImgCrop',
    'datePicker'
  ])
  .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);

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
          pageTitle: 'Joetz',
          backButton: 'Menu'
        }
      })
      .state('news', {
        url: '/nieuws',
        templateUrl: 'views/main.html',
        data: {
          pageTitle: 'Nieuwsoverzicht',
          backButton: 'Nieuws',
          backState: 'menu'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          pageTitle: 'Inloggen',
          backButton: 'Login',
          backState: 'menu'
        }
      })
      .state('photos', {
        url: '/fotos',
        templateUrl: 'views/photos/index.html',
        controller: 'PhotoCtrl',
        data: {
          pageTitle: 'Jouw foto\'s',
          backButton: 'Foto\'s',
          backState: 'menu'
        }
      })
      .state('monitors', {
        url: '/monitoren',
        template: '<ui-view />', 
        controller: 'MonitorCtrl',
      })
      .state('monitors.list', {
        url: '/', 
        templateUrl: 'views/monitors.html',
        controller: 'MonitorCtrl',
        data: {
          pageTitle: 'Monitoren',
          backButton: 'Monitor',
          backState: 'menu'
        }
      })
      .state('monitors.info', {
        url: '/:monitorId',
        templateUrl:'views/monitorInfo.html',
        data: {
          pageTitle: 'Monitoren',
          back: {
            button: 'Menu'
          }
        },
        controller: function($scope, userService, $stateParams){
          var monitorId = $stateParams.monitorId;
          userService.getMonitor(monitorId).then(function(monitor){
            $scope.selectedMonitor = monitor;
          });
        } 
      })
      .state('vacations', {
        url: '/vakanties',
        template: '<ui-view />',
        controller: 'VacationCtrl',
      })
      .state('vacations.photos', {
        url: '/:vacationId/fotos',
        templateUrl: 'views/vacation/photos.html',
        controller: function($scope, vacationService, $stateParams){
          var vacationId = $stateParams.vacationId;
          vacationService.getPhotos(vacationId).then(function(photos){
            $scope.photos = photos;
          });
        },
        data: {
          pageTitle: 'Foto\'s',
          backButton: 'Foto\'s',
          backState: 'vacations.detail'
        }
      })
      .state('vacations.list', {
        url: '/',
        templateUrl: 'views/vacations.html',
        data: {
          pageTitle: 'Vakantieoverzicht',
          backButton: 'Vakanties',
          backState: 'menu'
        }
      })
      .state('vacations.detail', {
        url: '/:vacationId/details', 
        templateUrl: 'views/vacation-detail.html', 
        controller: function($scope, vacationService, $stateParams) {
          var vacationId = $stateParams.vacationId;
          vacationService.getVacation(vacationId).then(function(vacation) {
            $scope.selectedVacation = vacation;
          });
        },
        data: {
          pageTitle: 'Vakantie',
          backButton: 'Vakantie',
          backState: 'vacations.list'
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
          backButton: 'Kinderen',
          backState: 'vacations.detail'
        }
      })
      .state('vacations.register.register-information', {
        url: '/informatie', 
        templateUrl: 'views/vacation/information.html',
        data: {
          pageTitle: 'Inschrijving',
          backButton: 'Inschrijving',
          backState: 'vacations.register.child-selection'
        }
      })
      .state('vacations.register.summary', {
        url: '/overzicht', 
        templateUrl: 'views/vacation/summary.html',
        data: {
          pageTitle: 'Bevestiging',
          backButton: 'Bevestig',
          backState: 'vacations.register.register-information'
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
          backButton: 'Registreer',
          backState: 'menu'
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
          backButton: 'Profiel',
          backState: 'menu'
        }
      })
      .state('profile.add-child', {
        url: '/kind/toevoegen',
        templateUrl: 'views/user/child-edit.html',
        data: {
          pageTitle: 'Kind toevoegen',
          backButton: 'Kind',
          backState: 'profile.overview'
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
          backButton: 'Admin',
          backState: 'menu'
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
          backButton: 'Gebruikers',
          backState: 'admin'
        }
      })
      .state('admin.user.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/user-edit.html',
        data: {
          pageTitle: 'Gebruiker aanmaken',
          backButton: 'Gebruiker',
          backState: 'admin.user.list'
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
          backButton: 'Gebruiker',
          backState: 'admin.user.list'
        }
      })
      .state('admin.user.edit.child', {
        url: '/:childId',
        templateUrl: 'views/admin/child-edit.html',
        controller: function($scope, userService, $stateParams, dateService) {
          var childId = $stateParams.childId;
          userService.getChild(childId).then(function(child) {
            $scope.selectedChild = child;
            $scope.selectedChild.date_of_birth_d = dateService.mySQLStringToDate(child.date_of_birth);
          }, function(err) {
            console.log(err);
          });
        },
        data: {
          pageTitle: 'Kind wijzigen',
          backButton: 'Kind',
          backState: 'admin.user.edit'
        }
      })
      .state('admin.category', {
        abstract: true,
        url: '/categorieen',
        template: '<ui-view />',
        controller: 'AdminCategoryCtrl'
      })
      .state('admin.category.list', {
        url: '/',
        templateUrl: 'views/admin/category.html',
        data: {
          pageTitle: 'Categorieën beheren',
          backButton: 'Categorie',
          backState: 'admin'
        }
      })
      .state('admin.category.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/category-edit.html',
        data: {
          pageTitle: 'Categorie aanmaken',
          backButton: 'Categorie',
          backState: 'admin.category.list'
        }
      })
      .state('admin.category.edit', {
        url: '/:categoryId/wijzig',
        templateUrl: 'views/admin/category-edit.html',
        controller: function($scope, categoryService, $stateParams) {
          var categoryId = $stateParams.categoryId;
          categoryService.getCategory(categoryId).then(function(category) {
            $scope.selectedCategory = category;
          });
        },
        data: {
          pageTitle: 'Category wijzigen',
          backButton: 'Categorie',
          backState: 'admin.category.list'
        }
      })
      .state('admin.registration', {
        abstract: true,
        url: '/inschrijvingen',
        template: '<ui-view />',
        controller: 'AdminRegistrationCtrl'
      })
      .state('admin.registration.list', {
        url: '/',
        templateUrl: 'views/admin/registration.html',
        data: {
          pageTitle: 'Inschrijvingen beheren',
          backButton: 'Inschrijving',
          backState: 'admin'
        }
      })
      .state('admin.registration.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/registration-edit.html',
        data: {
          pageTitle: 'Inschrijving aanmaken',
          backButton: 'Inschrijving',
          backState: 'admin.registration.list'
        }
      })
      .state('admin.registration.edit', {
        url: '/:registrationId/wijzig',
        templateUrl: 'views/admin/registration-edit.html',
        controller: function($scope, registrationService, $stateParams) {
          var registrationId = $stateParams.registrationId;
          registrationService.getRegistration(registrationId).then(function(registration) {
            $scope.selectedRegistration = registration;
          });
        },
        data: {
          pageTitle: 'Inschrijving wijzigen',
          backButton: 'Inschrijving',
          backState: 'admin.registration.list'
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
          backButton: 'Vakanties',
          backState: 'admin'
        }
      })
      .state('admin.vacation.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/vacation-edit.html',
        data: {
          pageTitle: 'Vakantie aanmaken',
          backButton: 'Vakantie',
          backState: 'admin.vacation.list'
        }
      })
      .state('admin.vacation.edit', {
        url: '/:vacationId/wijzig',
        templateUrl: 'views/admin/vacation-edit.html',
        controller: function($scope, vacationService, $stateParams, dateService) {
          var vacationId = $stateParams.vacationId;
          vacationService.getVacation(vacationId).then(function(vacation) {
            $scope.selectedVacation = vacation;
            $scope.selectedVacation.begin_date_d = dateService.mySQLStringToDate(vacation.begin_date);
            $scope.selectedVacation.end_date_d = dateService.mySQLStringToDate(vacation.end_date);
          });
        },
        data: {
          pageTitle: 'Vakantie wijzigen',
          backButton: 'Vakantie',
          backState: 'admin.vacation.list'
        }
      });
  })
  .run(function (Permission, userService, $rootScope, $location, $timeout, $window, $state) {
    $rootScope.previousState = {};
    $rootScope.scrollPosition = {};

    angular.element($window).bind('scroll', function() {
      if($rootScope.saveScrollPosition) {
        $rootScope.scrollPosition[$location.path()] = document.body.scrollTop;
      }
    });

    $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState.name = fromState.name;
        $rootScope.previousState.params = fromParams;
        var backState = $state.get($state.current.data.backState);
        if(backState) {
          $rootScope.backButton = backState.data.backButton;
        } else {
          delete $rootScope.backButton;
        }
        
        $timeout(function() {
            document.body.scrollTop = $rootScope.scrollPosition[$location.path()] ? $rootScope.scrollPosition[$location.path()] : 0;
            $rootScope.saveScrollPosition = true;
        }, 0);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState/*, toParams, fromState, fromParams*/) {
      $rootScope.saveScrollPosition = false;

      var _isMobile = function() {
          if (document.querySelector('md-toolbar').offsetHeight === 64) {
              return true;
          } else {
              return false;
          }
      };

      if(!_isMobile() && toState.name === 'menu') {
        event.preventDefault();
        $state.go('vacations.list');
      }
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

      if(!_isMobile() && $location.path() === '/') {
        $location.path('nieuws');
      }
  });
