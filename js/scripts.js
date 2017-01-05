var cinemaTycoonApp = angular.module('cinemaTycoonApp',[]);

cinemaTycoonApp.factory('gameData', function(){
	var game = {};
	var basicLeaseRent = 500;
	var promo = ["None"];
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits = 0;
	var weekSnackProfits = 0;
	var weekGamesProfits = 0;

	game.initial = {};
	game.initial.isStarted = false;						// Tracks whether player has started or not.

	game.timeData = {}
	game.timeData.day = 1;								// Tracks the day of the year.
	game.timeData.seasonIndex = 0;						// Enum index for season. (relevant for movie effectiveness)
	game.timeData.season =
		season[game.timeData.seasonIndex];				// The current season in enum value.
	game.timeData.year = 1;								// Total years user has been playing.

	game.miscData = {};
	game.miscData.balance = 10000;						// Player's bank balance.
	game.miscData.ticketPrice = 10.00;					// Price of a movie ticket.
	game.miscData.currentPromotionIndex = 0;			// Enum index for marketing promotion.
	game.miscData.currentPromotion =
		promo[game.miscData.currentPromotionIndex];		// Enum value for marketing promotion.
	game.miscData.promotionMultiplier = 500;			// Multiplier for marketing promotions.
	game.miscData.numOfLicenses = 1;					// Total number of movie licenses currently owned.

	game.theaterData = {};
	game.theaterData.theatersOwned = [];				// Contains the actual theater objects.
	game.theaterData.numOfTheaters =
		game.theaterData.theatersOwned.length;			// Player's total existing theaters.
	game.theaterData.maxTheaters = 10;					// Maximum number of theaters possible.
	game.theaterData.newTheaterPriceMultiplier = 1000;	// Multiplier for additional theaters.
	game.theaterData.totalSeats = 0;					// Total seats (possible tickets) cinema has.	

	game.snackData = {};
	game.snackData.numOfSnacks = 0;						// Player's total existing snack choices.
	game.snackData.maxSnacks = 5;						// Maximum number of snacks possible.
	game.snackData.newSnackPriceMultiplier = 500;		// Multiplier for additional snacks.

	game.gameroomData = {};
	game.gameroomData.numOfGames = 0;					// Player's total existing game choices.
	game.gameroomData.maxGames = 5;						// Maximum number of games possible.
	game.gameroomData.newGamePriceMultiplier = 1000;	// Multiplier for additional games.

	game.employeeData = {};
	game.employeeData.numOfEmployees = 1;				// Player's current number of employed workers.
	game.employeeData.maxEmployees = 5;					// Maximum number of employees possible.
	game.employeeData.employeeResult = employ[0];		// Description of employee amount.
	game.employeeData.employeeCostMultiplier = 500;		// Multiplier for employees on payday.
	
	game.parkingData = {};
	game.parkingData.parkingLevels = 0;					// Current parking lot capacity level.
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
		game.addTheater(); // TODO: Delete this chunk after done testing.
	};
	// Main time-keeping function that serves as a simple game loop.
	game.newDay = function() {
		// Calculates profits every day.
		var profits = calculateDailyProfits();
		game.miscData.balance += profits;
		// Calculates expenses every week, and modifies HUD for weekly expense & profit.
		if(game.timeData.day % 7 === 0)
		{
			var expenses = calculateWeeklyExpenses();
			game.profitData.expenses = expenses;
			game.miscData.balance -= expenses;
			game.profitData.profitTicketSales = weekTicketProfits;
			game.profitData.profitSnackSales = weekSnackProfits;
			game.profitData.profitSnackSales = weekGamesProfits;
			game.profitData.netProfit = weekTicketProfits + weekSnackProfits + weekGamesProfits - expenses;
			weekTicketProfits = 0;
			weekSnackProfits = 0;
			weekGamesProfits = 0;
		}
		// Updates the day, season, and year.
		if(game.timeData.day === 365)
		{
			game.timeData.day = 1;
			game.timeData.year++;
			game.timeData.seasonIndex = 0;
			game.timeData.season = season[game.timeData.seasonIndex];
		}
		else
		{
			game.timeData.day++;
			if(game.timeData.day === 91) game.timeData.seasonIndex = 1;
			else if(game.timeData.day === 181) game.timeData.seasonIndex = 2;
			else if(game.timeData.day === 271) game.timeData.seasonIndex = 3;
			game.timeData.season = season[game.timeData.seasonIndex];
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
				var salon = createTheater();
				game.theaterData.theatersOwned.push(salon);
				game.theaterData.numOfTheaters = game.theaterData.theatersOwned.length;
				var totalSeats = 0;
				for(var i = 0; i < game.theaterData.theatersOwned.length; i++)
				{
					totalSeats += game.theaterData.theatersOwned[i].getSeats();
				}
				game.theaterData.totalSeats = totalSeats;
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
	calculateDailyProfits = function() {
		var dailyProfit = 0;
		// Initial ticket sale modifier before pros and cons are weighed.
		var dailyPatronModifier = (Math.random() + 0.01);
		// Additional parking encourages patronage.
		dailyPatronModifier += game.parkingData.parkingLevels + 0.01;
		// More employees means better service and cleaner establishment = more patrons.
		dailyPatronModifier *= (game.employeeData.numOfEmployees / (game.employeeData.maxEmployees / 2));
		// Ticket price has direct impact on patronage.
		if(game.miscData.ticketPrice < 5) dailyPatronModifier += 0.05;
		else if(game.miscData.ticketPrice >= 5 && game.miscData.ticketPrice < 7.5) dailyPatronModifier += 0.025;
		else if(game.miscData.ticketPrice >= 7.5 && game.miscData.ticketPrice < 10) dailyPatronModifier += 0.01;
		else if(game.miscData.ticketPrice >= 12.5 && game.miscData.ticketPrice < 15) dailyPatronModifier -= 0.01;
		else if(game.miscData.ticketPrice >= 15 && game.miscData.ticketPrice < 17.5) dailyPatronModifier -= 0.025;
		else if(game.miscData.ticketPrice >= 17.5 && game.miscData.ticketPrice < 20) dailyPatronModifier -= 0.05;
		else dailyPatronModifier -= 0.5;
		if(dailyPatronModifier <= 0) dailyPatronModifier = 0.01;
		// Now to apply modifier to the available seats in all theaters.
		var ticketsSoldToday = 0;
		for(var i = 0; i < game.theaterData.theatersOwned.length; i++)
		{
			ticketsSoldToday += game.theaterData.theatersOwned[i].getTicketsSold(dailyPatronModifier, game.timeData.seasonIndex);
		}
		// 5 showings a day
		ticketsSoldToday *= 5;
		dailyProfit = ticketsSoldToday * game.miscData.ticketPrice;
		weekTicketProfits += dailyProfit;

		// Based on ticket sales, how many snacks were purchased.
		// TODO: Snacks.
		var snackProfit = 0;
		dailyProfit += snackProfit;
		weekSnackProfits += snackProfit;

		// Based on ticket sales, how many games were played.
		// TODO: Games.
		var gamesProfit = 0;
		dailyProfit += gamesProfit;
		weekGamesProfits += gamesProfit;

		return dailyProfit;
	};
	calculateWeeklyExpenses = function() {
		return  ( basicLeaseRent +
				(game.theaterData.numOfTheaters * (0.25 * game.theaterData.newTheaterPriceMultiplier)) +
				(game.snackData.numOfSnacks * (0.10 * game.snackData.newSnackPriceMultiplier)) +
				(game.gameroomData.numOfGames * (0.10 * game.gameroomData.newGamePriceMultiplier)) +
				(game.employeeData.numOfEmployees * game.employeeData.employeeCostMultiplier) +
				(game.parkingData.parkingLevels * (0.15 * game.parkingData.parkingExpandCost)) +
				(game.miscData.currentPromotionIndex * game.miscData.promotionMultiplier) );
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
	self.gameroomData = game.gameroomData;
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
		game.startGame();
		self.intervalPromise = $interval(game.newDay, (1000 * speed));
	};
}]);

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

var createTheater = function() {
	var seats = 10;
	var seatCost = 200;
	var maxSeats = 100;

	var projectorLevel = 1;
	var screenLevel = 1;
	var soundLevel = 1;
	var maxUpgradeLevel = 10;
	var upgradeMultiplier = 300;

	var moviePlaying = {optimalSeason: 1, // TODO: change to {} after testing.
						worstSeason: 1,
						actualPopularity: 0.5};
	var isMoviePlaying = true; // TODO: change to false after testing.

	return {
		getTicketsSold: function(modifier, season) {
			if(!isMoviePlaying) return 0;
			else
			{
				modifier += (projectorLevel * 0.01) + (screenLevel * 0.01) + (soundLevel * 0.01);
				if(season === moviePlaying.optimalSeason) modifier += 0.1;
				if(season === moviePlaying.worstSeason) modifier -= 0.1;
				modifier += (moviePlaying.actualPopularity * 0.1);
				modifier *= seats;
				var seatsFilled = Math.ceil(modifier);
				if(seatsFilled >= seats) return seats;
				else return seatsFilled;
			}
		},
		getSeats: function() {
			return seats;
		},
		getSeatCost: function() {
			return seatCost;
		},
		getMaxSeats: function() {
			return maxSeats;
		},
		addSeats: function(quantity, balance) {
			if(balance < (seatCost * quantity)) return balance;
			else if (quantity <= (maxSeats - seats))
			{
				seats += quantity;
				balance -= seatCost * quantity;
				return balance;
			}
			else
			{
				var actualQuantity = maxSeats - seats;
				seats = maxSeats;
				balance -= seatCost * actualQuantity;
				return balance;
			}
		},
		getProjectorLevel: function() {
			return projectorLevel;
		},
		upgradeProjectorLevel: function(balance) {
			if(projectorLevel >= maxUpgradeLevel) projectorLevel = maxUpgradeLevel;
			else if( (projectorLevel + 1) * upgradeMultiplier <= balance ) projectorLevel++;
		},
		getScreenLevel: function() {
			return screenLevel;
		},
		upgradeScreenLevel: function(balance) {
			if(screenLevel >= maxUpgradeLevel) screenLevel = maxUpgradeLevel;
			else if( (screenLevel + 1) * upgradeMultiplier <= balance ) screenLevel++;
		},
		getSoundLevel: function() {
			return soundLevel;
		},
		upgradeSoundLevel: function(balance) {
			if(soundLevel >= maxUpgradeLevel) soundLevel = maxUpgradeLevel;
			else if( (soundLevel + 1) * upgradeMultiplier <= balance ) soundLevel++;
		},
		getUpgradeMultiplier: function() {
			return upgradeMultiplier;
		},
		getMaxUpgradeLevel: function() {
			return maxUpgradeLevel;
		},
		getMoviePlaying: function() {
			return moviePlaying;
		},
		setMoviePlaying: function(movie) {
			if(movie === undefined || movie === null) return;
			// This is how we set no movie to play.
			if(movie === 0)
			{
				moviePlaying = {};
				isMoviePlaying = false;
				return;
			}
			// Ensures only legit movies make it into the theater itself.
			if(movie.title === undefined || movie.title === null || movie.title === "") return;
			if(movie.synopsis === undefined || movie.synopsis === null || movie.synopsis === "") return;
			if(movie.expectedPopularity === undefined || movie.expectedPopularity === null || movie.expectedPopularity < 0 || movie.expectedPopularity > 1) return;
			if(movie.actualPopularity === undefined || movie.actualPopularity === null || movie.actualPopularity < 0 || movie.actualPopularity > 1) return;
			if(movie.optimalSeason === undefined || movie.optimalSeason === null || movie.optimalSeason < 0 || movie.optimalSeason > 3) return;
			if(movie.worstSeason === undefined || movie.worstSeason === null || movie.worstSeason < 0 || movie.worstSeason > 3) return;
			if(movie.costLicense === undefined || movie.costLicense === null || movie.costLicense < 0) return;
			if(movie.licenseLength === undefined || movie.licenseLength === null || movie.licenseLength <= 0) return;
			// Assumes everything checked out perfectly.
			moviePlaying = movie;
			isMoviePlaying = true;
		},
		isMoviePlaying: function() {
			return isMoviePlaying;
		}
	}
};