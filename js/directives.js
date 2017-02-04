cinemaTycoonApp.directive("flipping", function()
{
	return function(scope, element, attrs)
	{
		element.bind("click", function(event)
		{
			scope.$apply(function()
			{
				if(attrs["active"] === "false")
				{
					attrs.$set("active", "true");
					scope.$eval(attrs.entering);
				}
				else if(attrs["active"] === "true")
				{
					attrs.$set("active", "false");
 					scope.$eval(attrs.exiting);
				}
			});
		});
	}
});