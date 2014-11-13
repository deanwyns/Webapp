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

	$scope.submit = function() {
		$scope.errors = {};

		var userPromise = userService.register($scope.registerModel).then(function(response) {
			console.log(response);
		}, function(err) {
			var errors = {};
            for(var key in err.errors) {
            	errors[key] = err.errors[key][0];
            }

            $scope.errors = errors;
		});

		$scope.registerTracker.addPromise(userPromise);
	};
}]);