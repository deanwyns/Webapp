'use strict';

angular.module('joetzApp')
	.factory('queryBuilder', [function() {
		var _build = function(model) {
			var rtn = '';

			for(var property in model) {
				if(!model.hasOwnProperty(property)) {
					continue;
				}

				if(rtn !== '') {
					rtn += '&';
				}

				rtn += property + '=' + encodeURIComponent(model[property]);
			}

			return rtn;
		};

		return {
			build: _build
		};
	}]);