'use strict';

angular.module('joetzApp')
  .controller('RegisterCtrl', ['$scope', 'userService', 'promiseTracker', '$state', '$mdToast', function ($scope, userService, promiseTracker, $state, $mdToast) {
	$scope.errors = {};
	$scope.registerModel = {
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmed: '',
		phone_number: ''
	};

	$scope.registerTracker = promiseTracker();

	$scope.submit = function() {
		$scope.errors = {};

		var userPromise = userService.register($scope.registerModel).then(function() {
			$state.go('login');
			$mdToast.show($mdToast.simple().content('Je account is succesvol aangemaakt.'));
		}, function(err) {
			var errors = {};
            for(var key in err.errors.messages) {
            	errors[key] = err.errors.messages[key][0];
            }

            $scope.errors = errors;
		});

		$scope.registerTracker.addPromise(userPromise);
	};
}]);