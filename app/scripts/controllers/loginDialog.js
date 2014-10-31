'use strict';

angular.module('joetzApp')
  .controller('LoginDialogCtrl', function ($scope, $mdDialog) {
	  $scope.closeDialog = function() {
	    $mdDialog.hide();
	  };
  });
