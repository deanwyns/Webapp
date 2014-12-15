'use strict';

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

                if($state.current.data.backState) {
                    stateName = $state.current.data.backState;
                    stateParams = $rootScope.previousState.params;
                } else if ($rootScope.previousState.name) {
                    stateName = $rootScope.previousState.name;
                    stateParams = $rootScope.previousState.params;
                } else {
                    stateName = defaultState;
                    stateParams = defaultStateParams;
                }

                /*if ($rootScope.previousState.name) {
                    stateName = $rootScope.previousState.name;
                    stateParams = $rootScope.previousState.params;
                }
                else {
                    stateName = defaultState;
                    stateParams = defaultStateParams;
                }*/

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