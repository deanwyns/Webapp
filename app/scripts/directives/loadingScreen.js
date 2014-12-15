'use strict';

/**
 * Directive voor het laadscherm. Zou bij een broadcast "loading:done"
 * het attribuut "loading" moeten verwijderen (waardoor het laadscherm verdwijnt).
 * Om een of andere reden wordt deze broadcast niet ontvangen bij het meteen naar
 * een specifieke URL gaan (bv /vakanties/). Werkte wel bij het navigeren naar de root
 * van de website (alhoewel dit bij het prutsen soms ook vreemd deed).
 */
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