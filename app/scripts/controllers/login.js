'use strict';

angular.module('joetzApp')
  .controller('LoginCtrl', ['$scope', 'userService', 'promiseTracker', function ($scope, userService, promiseTracker) {
	$scope.loginModel = {
		email: '',
		password: ''
	};

	$scope.errors = {};
	$scope.loginTracker = promiseTracker();

	$scope.submit = function() {
		$scope.errors = {};

		var userPromise = userService.login($scope.loginModel).then(function(user) {
			$scope.$emit('user:loggedIn', user);
		}, function(err) {
			$scope.errors.login = err.error_description;
		});

		$scope.loginTracker.addPromise(userPromise);
	};
}]);