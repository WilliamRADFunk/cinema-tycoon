cinemaTycoonApp.directive("entering", function() {
	return function(scope, element, attrs) {
		element.bind("mouseenter", function() {
			scope.$apply(function() {
				scope.$eval(attrs.entering);
			});
		})
	}
});

cinemaTycoonApp.directive("exiting", function() {
	return function(scope, element, attrs) {
		element.bind("mouseleave", function() {
			scope.$apply(function() {
				scope.$eval(attrs.exiting);
			});
		})
	}
});