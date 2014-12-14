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
    'lr.upload',
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
          pageTitle: 'Joetz'
        }
      })
      .state('news', {
        url: '/nieuws',
        templateUrl: 'views/main.html',
        data: {
          pageTitle: 'Nieuwsoverzicht',
          back: {
            button: 'Menu'
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
            button: 'Menu'
          }
        }
      })
      .state('photos', {
        url: '/fotos',
        templateUrl: 'views/photos/index.html',
        controller: 'PhotoCtrl',
        data: {
          pageTitle: 'Jouw foto\'s',
          back: {
            button: 'Menu'
          }
        }
      })
      .state('monitoren', {
        url: '/monitoren',
        template: '<ui-view />', 
        controller: 'UserCtrl',
      })
      .state('monitoren.list', {
        url: '/', 
        templateUrl: 'views/monitors.html',
        controller: function($scope, userService){
          userService.getUsers().then(function(response){
            $scope.monitors= response;
          });
        },
        data: {
          pageTitle: 'Monitoren',
          back: {
            button: 'Menu'
          }
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
          back: {
            button: 'Vakantie'
          }
        }
      })
      .state('vacations.list', {
        url: '/',
        templateUrl: 'views/vacations.html',
        data: {
          pageTitle: 'Vakantieoverzicht',
          back: {
            button: 'Menu'
          }
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
            button: 'Vakantie'
          }
        }
      })
      .state('vacations.register.register-information', {
        url: '/informatie', 
        templateUrl: 'views/vacation/information.html',
        data: {
          pageTitle: 'Inschrijving',
          back: {
            button: 'Kinderen'
          }
        }
      })
      .state('vacations.register.summary', {
        url: '/overzicht', 
        templateUrl: 'views/vacation/summary.html',
        data: {
          pageTitle: 'Bevestiging',
          back: {
            button: 'Inschrijving'
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
            button: 'Menu'
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
            button: 'Menu'
          }
        }
      })
      .state('profile.add-child', {
        url: '/kind/toevoegen',
        templateUrl: 'views/user/child-edit.html',
        data: {
          pageTitle: 'Kind toevoegen',
          back: {
            button: 'Profiel'
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
            button: 'Menu'
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
            button: 'Menu'
          }
        }
      })
      .state('admin.user.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/user-edit.html',
        data: {
          pageTitle: 'Gebruiker aanmaken',
          back: {
            button: 'Lijst'
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
            button: 'Lijst'
          }
        }
      })
      .state('admin.user.edit.child', {
        params: { userId: {}, childId: {} },
        templateUrl: 'views/admin/child-edit.html',
        controller: function($scope, userService, $stateParams) {
          var childId = $stateParams.childId;
          userService.getChild(childId).then(function(child) {
            $scope.selectedChild = child;
          }, function(err) {
            console.log(err);
          });
        },
        data: {
          pageTitle: 'Gebruiker wijzigen',
          back: {
            button: 'Lijst'
          }
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
          back: {
            button: 'Lijst'
          }
        }
      })
      .state('admin.category.new', {
        url: '/nieuw',
        templateUrl: 'views/admin/category-edit.html',
        data: {
          pageTitle: 'Categorie aanmaken',
          back: {
            button: 'Lijst'
          }
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
          back: {
            button: 'Lijst'
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
            button: 'Lijst'
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
            button: 'Lijst'
          }
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
          back: {
            button: 'Lijst'
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

    $rootScope.$on('$stateChangeStart', function(event, toState/*, toParams, fromState, fromParams*/) {
      var _isMobile = function() {
          if (document.querySelector('md-toolbar').offsetHeight === 64) {
              return true;
          } else {
              return false;
          }
      };

      if(!_isMobile() && toState.name === 'menu') {
        event.preventDefault();
        $state.go('news');
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
