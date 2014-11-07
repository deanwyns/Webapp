'use strict';

angular.module('joetzApp')
  .controller('LoginCtrl', ['$scope', 'userService', 'promiseTracker', function ($scope, userService, promiseTracker) {
	$scope.loginModel = {
		email: '',
		password: ''
	};

	$scope.message = '';
	$scope.loginTracker = promiseTracker();

	$scope.submit = function() {
		$scope.message = '';

		var userPromise = userService.login($scope.loginModel).then(function(user) {
			$scope.$emit('user:loggedIn', user);
		}, function(err) {
			$scope.message = err.error_description;
		});

		$scope.loginTracker.addPromise(userPromise);
	};
}]);