'use strict';

/**
 * Directive die een klik-event op een element toevoegt.
 * Bij de klik navigeer terug naar de vorige state, of
 * de vorige state definieert in de state-definitie.
 */
angular.module('joetzApp')
    .directive('backButton', [
    '$rootScope',
    '$state',
    '$parse',
function($rootScope, $state, $parse) {
    return {
        restrict: 'EA',
        link: function(scope, el, attrs) {
            var defaultState, defaultStateParams;

            el.on('click', function() {
                var stateName, stateParams;

                // Als de vorige state gedefinieerd staat
                // in de state-definitie (van de huidige state)
                // zetten we de state-naam op deze.
                if($state.current.data.backState) {
                    stateName = $state.current.data.backState;
                    stateParams = $rootScope.previousState.params;
                // Anders gebruiken we de naam van de vorige
                // state die opgeslagen is geweest bij de
                // state-change.
                } else if ($rootScope.previousState.name) {
                    stateName = $rootScope.previousState.name;
                    stateParams = $rootScope.previousState.params;
                // En anders gebruiken we de standaard-state.
                } else {
                    stateName = defaultState;
                    stateParams = defaultStateParams;
                }

                // Als de state-naam bestaat, navigeren we er naar
                if (stateName) {
                    $state.go(stateName, stateParams);
                }
            });

            attrs.$observe('defaultState', function() {
                defaultState = attrs.defaultState;
            });
            attrs.$observe('defaultStateParams', function() {
                defaultStateParams = $parse(attrs.defaultStateParams)(scope);
            });

            $rootScope.$watch('previousState', function(val) {
                el.attr('disabled', !val.name && !defaultState);
            });
        }
    };
}]);