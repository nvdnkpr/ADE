/* ==================================================================
	AngularJS Datatype Editor - URL
	A filter to display a string as a clickable URL.
	Wraps Angular's native linky filter so that we can handle more 
	inputs
	
	Usage:
	{{ data | url }}

------------------------------------------------------------------*/

'use strict';

var URL_REGEXP = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

adeModule.filter('url', function($filter) {
	return function(input) {
		var output = '',
			html = '';

		if (URL_REGEXP.test(input)) {
			html = $filter('linky')(input);
		} else {
			if (input.indexOf(".") >= 0) {
				output = 'http://' + input;
				html = '<a href="' + output + '">' + output + '</a>';
			} else {
				html = input;
			}
		}

		return html;
	};
});

