'use strict';

angular.module('joetzApp')
  .controller('LoginDialogCtrl', ['$scope', '$mdDialog', 'authService', function ($scope, $mdDialog, authService) {
	$scope.loginModel = {
		email: '',
		password: ''
	};

	$scope.message = '';

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.submit = function() {
		$scope.message = '';

		authService.login($scope.loginModel).then(function(response) {
			$mdDialog.hide(response);
		}, function(err) {
			$scope.message = err.error_description;
		});
	};
}]);