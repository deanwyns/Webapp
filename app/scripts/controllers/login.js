'use strict';

angular.module('joetzApp')
  .controller('LoginCtrl', ['$scope', 'userService', function ($scope, userService) {
	$scope.loginModel = {
		email: '',
		password: ''
	};

	$scope.message = '';

	$scope.submit = function() {
		$scope.message = '';

		userService.login($scope.loginModel).then(function(response) {
			$scope.message = response;
		}, function(err) {
			$scope.message = err.error_description;
		});
	};
}]);