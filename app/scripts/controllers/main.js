'use strict';

/**
 * @ngdoc function
 * @name joetzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the joetzApp
 */
angular.module('joetzApp')
  .controller('MainCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
	$scope.openDialog = function($event) {
		$mdDialog.show({
			targetEvent: $event,
			controller: 'LoginDialogCtrl',
			templateUrl: 'views/loginDialog.html'
		}).then(function(response) {
			$scope.email = response.access_token;
		}, function() {
			//Cancelled
		});
	};
}]);
