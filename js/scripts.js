var cinemaTycoonApp = angular.module('cinemaTycoonApp',[]);

cinemaTycoonApp.factory('gameData', function(){
	var game = {};							// 

	game.balance = 1000;					// Player's bank balance.
	game.numOfTheaters = 1;					// Player's total existing theaters.
	game.maxTheaters = 10;					// Maximum number of theaters possible.
	game.newTheaterPriceMultiplier = 1000;	// Multiplier for additional theaters.
	game.numOfLicenses = 1;					// Total number of movie licenses currently owned.
	game.numOfSnacks = 1;					// Player's total existing snack choices.
	game.maxSnacks = 6;						// Maximum number of snacks possible.
	game.newSnackPriceMultiplier = 500;		// Multiplier for additional snacks.
	game.numOfEmployees = 1;				// Player's current number of employed workers.
	game.maxEmployees = 5;					// Maximum number of employees possible.
	game.employeeCostMultiplier = 750;		// Multiplier for employees on payday.
	game.ticketPrice = 10.00;				// Price of a movie ticket.
	game.currentPromotion = 0;				// Enum value for marketing promotion.

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
			game.numOfTheaters = game.maxTheaters
		}
		else
		{
			var cost = (game.numOfTheaters + 1) * game.newTheaterPriceMultiplier;
			if( cost <= game.balance) game.numOfTheaters++;
		}
	};
	// Adds a snack iff player has the money.
	game.addSnack = function() {
		if(game.numOfSnacks >= game.maxSnacks)
		{
			game.numOfSnacks = game.maxSnacks
		}
		else
		{
			var cost = (game.numOfSnacks + 1) * game.newSnackPriceMultiplier;
			if( cost <= game.balance) game.numOfSnacks++;
		}
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

	self.lowerTicketPrice = function() {
		game.lowerTicketPrice();
	}

	self.raiseTicketPrice = function() {
		game.raiseTicketPrice();
	}
}]);