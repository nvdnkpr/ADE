/* ==================================================================
	AngularJS Datatype Editor - Email
	A directive to edit an email field in place

	Usage:
	<div ade-email='{"class":"input-medium","id":"1234"}' ng-model="data">{{data}}</div>

	Config:
	"class" will be added to the input box so you can style it.
	"id" will be used in messages broadcast to the app on state changes.

	Messages:
		name: ADE-start  
		data: id from config

		name: ADE-finish
		data: {id from config, old value, new value, exit value}

------------------------------------------------------------------*/
var URL_REGEXP = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

adeModule.directive('adeEmail', ['ADE','$compile','$rootScope', '$filter', function(ADE,$compile,$rootScope,$filter) {
	return {
		require: '?ngModel', //optional dependency for ngModel
		restrict: 'A', //Attribute declaration eg: <div ade-email=""></div>

		//The link step (after compile)
		link: function($scope, element, attrs, controller) {
			var options = {}; //The passed in options to the directive.
			var editing=false; //are we in edit mode or not
			var input = null; //a reference to the input DOM object
			var value = "";
			var oldValue = "";
			var exit = 0; //0=click, 1=tab, -1= shift tab, 2=return, -2=shift return, 3=esc. controls if you exited the field so you can focus the next field if appropriate

			//whenever the model changes, we get called so we can update our value
			if (controller != null) {
				controller.$render = function() { 
					oldValue = value = controller.$modelValue;
					if(value==undefined || value==null) value="";
					return controller.$viewValue;
				};
			}

			//called once the edit is done, so we can save the new data	and remove edit mode
			var saveEdit = function(exited) {
				oldValue = value;
				exit = exited;

				if(exited!=3) { //don't save value on esc
					value = input.val();
					controller.$setViewValue(value);
				}

				// I think that the apply later is sufficient
				// not sure what the significance is of doing the work inside the appy function
				// $scope.$apply(function() {
				// 	return controller.$setViewValue(value);
				// });

				element.show();
				input.remove();
				editing=false;

				ADE.done(options,oldValue,value,exit);

				$scope.$apply();
			};
			
			//handles clicks on the read version of the data
			element.bind('click', function() {
				if(editing) return;
				editing=true;
				exit = 0;

				value = $scope.emailstring;

				ADE.begin(options);

				element.hide();				
				$compile('<input type="text" class="'+options.class+'" value="'+value+'" />')($scope).insertAfter(element);
				input = element.next('input');
				input.focus();
				
				ADE.setupBlur(input,saveEdit);
				ADE.setupKeys(input,saveEdit);

				//make sure we aren't already digesting/applying before we apply the changes
				if(!$scope.$$phase) {
					return $scope.$apply(); //This is necessary to get the model to match the value of the input
				}
			});

			// Watches for changes to the element
			return attrs.$observe('adeEmail', function(settings) { //settings is the contents of the ade-email="" string
				options = ADE.parseSettings(settings, {class:"input-medium"});
				return element; //TODO: not sure what to return here
			});

		}
	};
}]);