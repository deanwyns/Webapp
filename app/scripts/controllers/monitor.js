'use strict';

angular.module('joetzApp')
	.controller('MonitorCtrl', ['$scope', 'userService', function($scope, userService) {

	/**
	 * Laadt de monitors
	 * @return {void} 
	 */
	var _loadMonitors = function(){
		userService.getMonitors().then(function(monitors) {
			$scope.monitors = monitors;
		}, function(err) {
			console.log(err);
		});
	};
	_loadMonitors();

	}]);