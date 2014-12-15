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

	/**
	 * Wordt opgeroepen als de gebruiker wilt registreren.
	 * @return {void} 
	 */
	$scope.submit = function() {
		$scope.errors = {};

		// Stuur een register-request met het register-model.
		var userPromise = userService.register($scope.registerModel).then(function() {
			// Als hij succesvol geregistreerd is, wordt hij doorgeleid naar de login-pagina.
			$state.go('login');
			// Toon een toast met een melding
			$mdToast.show($mdToast.simple().content('Je account is succesvol aangemaakt.'));
		}, function(err) {
			// Voeg eventuele foutmeldingen toe aan de scope
			var errors = {};
            for(var key in err.errors.messages) {
            	errors[key] = err.errors.messages[key][0];
            }

            $scope.errors = errors;
		});

		$scope.registerTracker.addPromise(userPromise);
	};
}]);