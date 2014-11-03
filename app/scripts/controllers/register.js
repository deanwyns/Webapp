'use strict';

angular.module('joetzApp')
  .controller('RegisterCtrl', ['$scope', 'userService', function ($scope, userService) {
	$scope.registerModel = {
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: ''
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