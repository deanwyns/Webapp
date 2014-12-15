'use strict';

/**
 * Filter die de tekst parset naar een datum
 */
angular.module('joetzApp')
.filter('asDate', function () {
    return function (input) {
        return new Date(input);
    };
});