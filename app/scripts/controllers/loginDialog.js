'use strict';

angular.module('joetzApp')
  .controller('LoginDialogCtrl', ['$scope', '$mdDialog', 'userService', 'promiseTracker',
	function ($scope, $mdDialog, userService, promiseTracker) {
		$scope.loginModel = {
			email: '',
			password: ''
		};

		$scope.errors = {};
		$scope.loginTracker = promiseTracker();

		/**
		 * Wordt opgeroepen als het dialoogvenster geannuleerd wordt
		 * @return {void} 
		 */
		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		/**
		 * Wordt opgeroepen als er via het dialoogvenster wordt ingelogd
		 * @return {[type]} [description]
		 */
		$scope.submit = function() {
			$scope.errors = {};

			var userPromise = userService.login($scope.loginModel).then(function(user) {
				// Verstop het dialoogvenster en return de user
				$mdDialog.hide(user);
			}, function(err) {
				// Voeg te foutmelding toe aan de scope om te tonen
				$scope.errors.login = err.error_description;
			});

			$scope.loginTracker.addPromise(userPromise);
		};
}]);