'use strict';

angular.module('joetzApp')
.filter('asDate', function () {
    return function (input) {
        return new Date(input);
    };
});