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
            for(var key in err.errors) {
                $scope.errors[key] = err.errors[key][0];
            }
		});

		$scope.registerTracker.addPromise(userPromise);
	};
}]);