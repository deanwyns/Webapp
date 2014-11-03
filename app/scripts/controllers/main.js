'use strict';

/**
 * @ngdoc function
 * @name joetzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the joetzApp
 */
angular.module('joetzApp')
  .controller('MainCtrl', ['$scope', '$mdDialog', 'userService', function ($scope, $mdDialog, userService) {
  	userService.init().then(function(user) {
  		if(user.isAuth) {
  			$scope.user = user;
  		}
  	});
  	
	$scope.openDialog = function($event) {
		$mdDialog.show({
			targetEvent: $event,
			controller: 'LoginDialogCtrl',
			templateUrl: 'views/loginDialog.html'
		}).then(function(user) {
			console.log(user);
			$scope.user = user;
		}, function() {
			//Cancelled
		});
	};

	$scope.logout = function() {
		userService.logout();
	};
}]);
