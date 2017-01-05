var cinemaTycoonApp = angular.module('cinemaTycoonApp',[]);

cinemaTycoonApp.factory('gameData', function(){
	var game = {};
	var promo = ["None"];
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];

	game.initial = {};
	game.initial.isStarted = false;						// Tracks whether player has started or not.

	game.timeData = {}
	game.timeData.day = 1;								// Tracks the day of the year.
	game.timeData.season = season[0];					// The current season (relevant for movie effectiveness).
	game.timeData.year = 1;								// Total years user has been playing.

	game.miscData = {};
	game.miscData.balance = 10000;						// Player's bank balance.
	game.miscData.ticketPrice = 10.00;					// Price of a movie ticket.
	game.miscData.currentPromotion = promo[0];			// Enum value for marketing promotion.
	game.miscData.numOfLicenses = 1;					// Total number of movie licenses currently owned.

	game.theaterData = {};
	game.theaterData.numOfTheaters = 1;					// Player's total existing theaters.
	game.theaterData.maxTheaters = 10;					// Maximum number of theaters possible.
	game.theaterData.newTheaterPriceMultiplier = 1000;	// Multiplier for additional theaters.
	game.theaterData.totalSeats = 10;					// Total seats (possible tickets) cinema has.	

	game.snackData = {};
	game.snackData.numOfSnacks = 1;						// Player's total existing snack choices.
	game.snackData.maxSnacks = 6;						// Maximum number of snacks possible.
	game.snackData.newSnackPriceMultiplier = 500;		// Multiplier for additional snacks.

	game.gameroomData = {};
	game.gameroomData.numOfGames = 1;					// Player's total existing game choices.
	game.gameroomData.maxGames = 5;						// Maximum number of games possible.
	game.gameroomData.newGamePriceMultiplier = 1000;	// Multiplier for additional games.

	game.employeeData = {};
	game.employeeData.numOfEmployees = 1;				// Player's current number of employed workers.
	game.employeeData.maxEmployees = 5;					// Maximum number of employees possible.
	game.employeeData.employeeResult = employ[0];		// Description of employee amount.
	game.employeeData.employeeCostMultiplier = 750;		// Multiplier for employees on payday.
	
	game.parkingData = {};
	game.parkingData.parkingLevels = 1;					// Current parking lot capacity level.
	game.parkingData.maxParkingLevels = 10;				// Maximum number of parking levels possible.
	game.parkingData.parkingExpandCost = 2000			// Cost multiplier to expand local parking space.

	game.profitData = {};
	game.profitData.profitTicketSales = 0.0;			// Tally of total ticket's sold at cost in last period.
	game.profitData.profitSnackSales = 0.0;				// Tally of total snacks sold at cost in last period.
	game.profitData.expenses = 0.0;						// Total cost of running theater in last period.
	game.profitData.netProfit = 0.0;					// Total profit/loss for the last period.

	// Starts game
	game.startGame = function(speed) {
		game.initial.isStarted = true;
	};
	// Main time-keeping function that serves as a simple game loop.
	game.newDay = function() {
		console.log("Checking in");
		// TODO: Tally expenses for that day.
		if(game.timeData.day === 365)
		{
			game.timeData.day = 1;
			game.timeData.year++;
			game.timeData.season = season[0];
		}
		else
		{
			game.timeData.day++;
			if(game.timeData.day === 91) game.timeData.season = season[1];
			else if(game.timeData.day === 181) game.timeData.season = season[2];
			else if(game.timeData.day === 271) game.timeData.season = season[3];
		}
	};
	// Updates the reduction of ticket price for entire game.
	game.lowerTicketPrice = function() {
		game.miscData.ticketPrice -= 0.10;
		if(game.miscData.ticketPrice <= 0) game.miscData.ticketPrice = 0.0;
	};
	// Updates the increase of ticket price for entire game.
	game.raiseTicketPrice = function() {
		game.miscData.ticketPrice += 0.10;
		if(game.miscData.ticketPrice >= 100) game.miscData.ticketPrice = 100.0;
	};
	// Adds a theater iff player has the money.
	game.addTheater = function() {
		if(game.theaterData.numOfTheaters >= game.theaterData.maxTheaters)
		{
			game.theaterData.numOfTheaters = game.theaterData.maxTheaters;
		}
		else
		{
			var cost = (game.theaterData.numOfTheaters + 1) * game.theaterData.newTheaterPriceMultiplier;
			if( cost <= game.miscData.balance)
			{
				game.theaterData.numOfTheaters++;
				game.miscData.balance -= cost;
			}
		}
	};
	// Adds a snack iff player has the money.
	game.addSnack = function() {
		if(game.snackData.numOfSnacks >= game.snackData.maxSnacks)
		{
			game.snackData.numOfSnacks = game.snackData.maxSnacks;
		}
		else
		{
			var cost = (game.snackData.numOfSnacks + 1) * game.snackData.newSnackPriceMultiplier;
			if( cost <= game.miscData.balance)
			{
				game.snackData.numOfSnacks++;
				game.miscData.balance -= cost;
			}
		}
	};
	// Adds a game iff player has the money.
	game.addGame = function() {
		if(game.gameroomData.numOfGames >= game.gameroomData.maxGames)
		{
			game.gameroomData.numOfGames = game.gameroomData.maxGames;
		}
		else
		{
			var cost = (game.gameroomData.numOfGames + 1) * game.gameroomData.newGamePriceMultiplier;
			if( cost <= game.miscData.balance)
			{
				game.gameroomData.numOfGames++;
				game.miscData.balance -= cost;
			}
		}
	};
	// Adds extra parking iff player has the money.
	game.addParking = function() {
		if(game.parkingData.parkingLevels >= game.parkingData.maxParkingLevels)
		{
			game.parkingData.parkingLevels = game.parkingData.maxParkingLevels;
		}
		else
		{
			var cost = (game.parkingData.parkingLevels + 1) * game.parkingData.parkingExpandCost;
			if( cost <= game.miscData.balance)
			{
				game.parkingData.parkingLevels++;
				game.miscData.balance -= cost;
			}
		}
	};
	// Adds an extra employee to the theater.
	game.addEmployee = function() {
		if(game.employeeData.numOfEmployees >= game.employeeData.maxEmployees)
		{
			game.employeeData.numOfEmployees = game.employeeData.maxEmployees;
		}
		else
		{
			game.employeeData.numOfEmployees++;
			game.employeeData.employeeResult = employ[game.employeeData.numOfEmployees - 1];
		}
	};
	// Removes an employee from the theater.
	game.removeEmployee = function() {
		if(game.employeeData.numOfEmployees <= 1)
		{
			game.employeeData.numOfEmployees = 1;
		}
		else
		{
			game.employeeData.numOfEmployees--;
			game.employeeData.employeeResult = employ[game.employeeData.numOfEmployees - 1];
		}
	};
	// Pass one-way data to those dependent on the service.
	return game;
});
// Main function is to display theater data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.timeData = game.timeData;
	self.miscData = game.miscData;
	self.theaterData = game.theaterData;
	self.snackData = game.snackData;
	self.employeeData = game.employeeData;
	self.parkingData = game.parkingData;
	self.profitData = game.profitData;
}]);
// Main function is to adjust ticket price.
// Shows how much people like/dislike the price.
cinemaTycoonApp.controller('FrontDoorController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.miscData = game.miscData;
	self.active = false;

	self.lowerTicketPrice = function() {
		game.lowerTicketPrice();
	};

	self.raiseTicketPrice = function() {
		game.raiseTicketPrice();
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};
}]);
// Main function is to increase parking capacity.
cinemaTycoonApp.controller('ParkingLotController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.parkingData = game.parkingData;
	self.active = false;

	self.expandParking = function() {
		game.addParking();
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};
}]);
// Main function is to increase snacks offered.
cinemaTycoonApp.controller('SnackController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.snackData = game.snackData;
	self.active = false;

	self.increaseSnacks = function() {
		game.addSnack();
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};
}]);
// Main function is to increase games offered.
cinemaTycoonApp.controller('GameroomController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.gameroomData = game.gameroomData;
	self.active = false;

	self.increaseGames = function() {
		game.addGame();
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};
}]);
// Main function is to handle employees, choose promotions, or make a movie.
cinemaTycoonApp.controller('OfficeController', ['gameData', function(game) {
	var self = this;

	self.initial = game.initial;
	self.miscData = game.miscData;
	self.employeeData = game.employeeData;
	self.active = false;

	self.hireEmployee = function() {
		game.addEmployee();
	};

	self.fireEmployee = function() {
		game.removeEmployee();
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};
}]);
// Main function is to instigate the game timer.
cinemaTycoonApp.controller('StartController', ['gameData', '$interval', function(game, $interval) {
	var self = this;

	self.initial = game.initial;


	self.activateTime = function(speed) {
		console.log("Begin");
		game.startGame();
		$interval(game.newDay, (1000 * speed));
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