'use strict';

/**
 * Simpele directive die de omslachtige html moet vervangen.
 */
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