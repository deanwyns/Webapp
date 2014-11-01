'use strict';

angular.module('joetzApp')
  .controller('LoginDialogCtrl', ['$scope', '$mdDialog', 'userService', function ($scope, $mdDialog, userService) {
	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.submit = function(loginModel) {
		userService.login(loginModel).then(function(response) {
			$mdDialog.hide(response);
		}, function() {
			console.log('error!');
		});
	};
}]);