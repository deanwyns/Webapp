'use strict';

angular.module('joetzApp')
  .controller('RegisterCtrl', ['$scope', 'userService', 'promiseTracker', function ($scope, userService, promiseTracker) {
	$scope.errors = {};
	$scope.registerModel = {
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: '',
		phone_number: ''
	};

	$scope.registerTracker = promiseTracker();

	$scope.message = '';

	/*var _validate = function() {

	}*/

	$scope.submit = function() {

		$scope.message = '';

		var userPromise = userService.register($scope.registerModel).then(function(response) {
			console.log(response);
		}, function(err) {
			$scope.message = err;
		});

		$scope.registerTracker.addPromise(userPromise);
	};
}]);