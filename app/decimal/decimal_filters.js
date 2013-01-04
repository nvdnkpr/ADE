/* ==================================================================
	AngularJS Datatype Editor - Decimal
	A filter to display a number as a decimal
	Wrapper for Angular's built in filter so that we can display
	invalid inputs correctly.
	
	Usage:
	{{ data | decimal:2 }}

------------------------------------------------------------------*/

'use strict';

adeModule.filter('decimal', function($filter) {

	return function(input, fractionSize) {
		var output = '';
		var fractionSize = fractionSize || 2;

		if (angular.isUndefined(input) || !angular.isNumber(input)) return output;

		output = $filter('number')(input,fractionSize);

  		return output;
	 };
});

