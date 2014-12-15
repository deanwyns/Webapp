'use strict';

/**
 * Directive voor het toevoegen van "multiline" aan Angular Material
 * tekstvelden. Aangezien er geen textarea-elementen beschikbaar zijn
 * in Angular Material, wordt deze directive gebruikt icm md-text-float.
 * Verandert de text-input met een textarea.
 */
angular.module('joetzApp')
    .directive('multiline', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        compile: function(wrappedElement, attributes) {
            var element = wrappedElement[0],
                input = element.querySelector('input');

                element.innerHTML += '<textarea ng-model="value" class="ng-touched" style="width: 100%; min-height: ' + attributes.height + 'px"></textarea>';

            $timeout(function() {
                element.querySelector('input').style.display = 'none';

                element.querySelector('textarea').addEventListener('blur', function() {
                    element.classList.remove('md-input-focused');
                });

                element.querySelector('textarea').addEventListener('focus', function() {
                    element.classList.add('md-input-focused');
                });
            }, 0)
        }
    }
}]);