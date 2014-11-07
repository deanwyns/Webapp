'use strict';

angular.module('joetzApp')
  .controller('LoginDialogCtrl', ['$scope', '$mdDialog', 'userService', 'promiseTracker',
	function ($scope, $mdDialog, userService, promiseTracker) {
		$scope.loginModel = {
			email: '',
			password: ''
		};

		$scope.message = '';
		$scope.loginTracker = promiseTracker();

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.submit = function() {
			$scope.message = '';

			var userPromise = userService.login($scope.loginModel).then(function(user) {
				$mdDialog.hide(user);
			}, function(err) {
				$scope.message = err.error_description;
			});

			$scope.loginTracker.addPromise(userPromise);
		};
}]);