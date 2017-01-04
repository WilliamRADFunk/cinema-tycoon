var cinemaTycoonApp = angular.module('cinemaTycoonApp',[]);

cinemaTycoonApp.factory('gameData', function(){
	var game = {};
	var promo = ["None"];
	var employ = ["Dismal"];

	game.day = 1;							// Tracks the day of the year.
	game.season = "Winter";					// The current season (relevant for movie effectiveness).
	game.year = 1;							// Total years user has been playing.

	game.balance = 10000;					// Player's bank balance.
	game.numOfTheaters = 1;					// Player's total existing theaters.
	game.maxTheaters = 10;					// Maximum number of theaters possible.
	game.newTheaterPriceMultiplier = 1000;	// Multiplier for additional theaters.
	game.totalSeats = 10;					// Total seats (possible tickets) cinema has.
	game.numOfLicenses = 1;					// Total number of movie licenses currently owned.
	game.numOfSnacks = 1;					// Player's total existing snack choices.
	game.maxSnacks = 6;						// Maximum number of snacks possible.
	game.newSnackPriceMultiplier = 500;		// Multiplier for additional snacks.
	game.numOfEmployees = 1;				// Player's current number of employed workers.
	game.maxEmployees = 5;					// Maximum number of employees possible.
	game.employeeResult = employ[0];		// Description of employee amount.
	game.employeeCostMultiplier = 750;		// Multiplier for employees on payday.
	game.ticketPrice = 10.00;				// Price of a movie ticket.
	game.currentPromotion = promo[0];		// Enum value for marketing promotion.
	game.parkingLevels = 1;					// Current parking lot capacity level.
	game.maxParkingLevels = 10;				// Maximum number of parking levels possible.
	game.parkingExpandCost = 2000			// Cost multiplier to expand local parking space.

	game.profitTicketSales = 0.0;			// Tally of total ticket's sold at cost in last period.
	game.profitSnackSales = 0.0;			// Tally of total snacks sold at cost in last period.
	game.expenses = 0.0;					// Total cost of running theater in last period.

	game.netProfit = 0.0;					// Total profit/loss for the last period.

	// Updates the reduction of ticket price for entire game.
	game.lowerTicketPrice = function() {
		game.ticketPrice -= 0.10;
		if(game.ticketPrice <= 0) game.ticketPrice = 0.0;
	};
	// Updates the increase of ticket price for entire game.
	game.raiseTicketPrice = function() {
		game.ticketPrice += 0.10;
		if(game.ticketPrice >= 100) game.ticketPrice = 100.0;
	};
	// Adds a theater iff player has the money.
	game.addTheater = function() {
		if(game.numOfTheaters >= game.maxTheaters)
		{
			game.numOfTheaters = game.maxTheaters;
		}
		else
		{
			var cost = (game.numOfTheaters + 1) * game.newTheaterPriceMultiplier;
			if( cost <= game.balance)
			{
				game.numOfTheaters++;
				game.balance -= cost;
			}
		}
	};
	// Adds a snack iff player has the money.
	game.addSnack = function() {
		if(game.numOfSnacks >= game.maxSnacks)
		{
			game.numOfSnacks = game.maxSnacks;
		}
		else
		{
			var cost = (game.numOfSnacks + 1) * game.newSnackPriceMultiplier;
			if( cost <= game.balance)
			{
				game.numOfSnacks++;
				game.balance -= cost;
			}
		}
	};
	// Adds extra parking iff player has the money.
	game.addParking = function() {
		if(game.parkingLevels >= game.maxParkingLevels)
		{
			game.parkingLevels = game.maxParkingLevels;
		}
		else
		{
			var cost = (game.parkingLevels + 1) * game.parkingExpandCost;
			if( cost <= game.balance)
			{
				game.parkingLevels++;
				game.balance -= cost;
			}
		}
	};
	// Adds an extra employee to the theater.
	game.addEmployee = function() {
		if(game.numOfEmployees >= game.maxEmployees)
		{
			game.numOfEmployees = game.maxEmployees;
		}
		else game.numOfEmployees++;
	};
	// Removes an employee from the theater.
	game.addEmployee = function() {
		if(game.numOfEmployees <= 1)
		{
			game.numOfEmployees = 1;
		}
		else game.numOfEmployees--;
	};
	// Pass one-way data to those dependent on the service.
	return game;
});
// Main function is to display theater data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.content = game;
}]);
// Main function is to adjust ticket price.
// Shows how much people like/dislike the price.
cinemaTycoonApp.controller('FrontDoorController', ['gameData', function(game) {
	var self = this;

	self.content = game;
	self.active = false;

	self.lowerTicketPrice = function() {
		game.lowerTicketPrice();
	};

	self.raiseTicketPrice = function() {
		game.raiseTicketPrice();
	};

	self.entered = function() {
		console.log("Entered");
		self.active = true;
	};

	self.exited = function() {
		console.log("Exited");
		self.active = false;
	};
}]);
// Main function is to increase parking capacity.
cinemaTycoonApp.controller('ParkingLotController', ['gameData', function(game) {
	var self = this;

	self.content = game;
	self.active = false;

	self.expandParking = function() {
		game.addParking();
	};

	self.entered = function() {
		console.log("Entered");
		self.active = true;
	};

	self.exited = function() {
		console.log("Exited");
		self.active = false;
	};
}]);
// Main function is to increase snacks offered.
cinemaTycoonApp.controller('SnackController', ['gameData', function(game) {
	var self = this;

	self.content = game;
	self.active = false;

	self.increaseSnacks = function() {
		game.addSnack();
	};

	self.entered = function() {
		console.log("Entered");
		self.active = true;
	};

	self.exited = function() {
		console.log("Exited");
		self.active = false;
	};
}]);

cinemaTycoonApp.directive("entering", function(){
	return function(scope, element, attrs) {
		element.bind("mouseenter", function(){
			scope.$apply(function() {
				scope.$eval(attrs.entering);
			});
		})
	}
});

cinemaTycoonApp.directive("exiting", function(){
	return function(scope, element, attrs) {
		element.bind("mouseleave", function(){
			scope.$apply(function() {
				scope.$eval(attrs.exiting);
			});
		})
	}
});