'use strict';

/**
 * Filter die een string "highlight" door de achtergrond geel te maken van die bepaalde string
 */
angular.module('joetzApp')
.filter('highlight', function($sce) {
  return function(text, phrase) {
    if (phrase) {
		text = text.replace(new RegExp('('+phrase+')', 'gi'), '<span style="background: yellow">$1</span>');
    }
    
    return $sce.trustAsHtml(text);
  };
});