'use strict';

angular.module('joetzApp')
	.factory('queryBuilder', [function() {
		/**
		 * Methode om alle properties van een object te overlopen
		 * om er vervolgens een query-string van te maken.
		 * @param  {object} model Het model waarvan een query-string van gemaakt moet worden
		 * @return {string}       De query-string
		 */
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

		// Return een object met deze functie
		return {
			build: _build
		};
	}]);