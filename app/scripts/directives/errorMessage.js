'use strict';

angular.module('joetzApp')
	.directive('errorMessage', [function() {
		return {
			restrict: 'E',
			templateUrl: 'views/partials/errorMessage.html',
			replace: true,
			scope: {
				error: '=',
				show: '@error'
			}
		};
	}]);