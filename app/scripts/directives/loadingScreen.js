'use strict';

angular.module('joetzApp')
	.directive('loadingScreen', [function() {
		return {
			restrict: 'E',
			templateUrl: 'views/partials/loading.html',
			scope: {
				loadingText: '@',
				loadingImage: '@'
			},
			link: function(scope, element) {
				scope.$on('loading:done', function() {
					angular.element(element).removeAttr('loading');
				});
			}
		};
	}]);