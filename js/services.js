cinemaTycoonApp.factory('gameData', function(){
	var game = {};
	var basicLeaseRent = 1000;
	var promo = ["None"];
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits = 0;
	var weekSnackProfits = 0;
	var weekGamesProfits = 0;

	game.state = {};
	game.state.isStarted = false;						// Tracks whether player has started or not.
	game.state.isPaused = false;						// Tracks whether player has paused game.

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
	game.profitData.profitGamesSales = 0.0;				// Tally of total games sold at cost in last period.
	game.profitData.expenses = 0.0;						// Total cost of running theater in last period.
	game.profitData.netProfit = 0.0;					// Total profit/loss for the last period.

	// Starts game
	game.startGame = function(speed) {
		game.state.isStarted = true;
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
			game.profitData.profitGamesSales = weekGamesProfits;
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
		dailyPatronModifier += game.parkingData.parkingLevels * 0.01;
		// More employees means better service and cleaner establishment = more patrons.
		if((game.employeeData.numOfEmployees / (game.employeeData.maxEmployees / 2.0)) < 1)
		{
			dailyPatronModifier -= (game.employeeData.numOfEmployees / (game.employeeData.maxEmployees / 2.0)) * 0.1;
		}
		else if((game.employeeData.numOfEmployees / (game.employeeData.maxEmployees / 2.0)) > 1)
		{
			dailyPatronModifier += ((game.employeeData.numOfEmployees / (game.employeeData.maxEmployees / 2.0)) - 1) * 0.01;
		}
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
		// 3 showings a day
		ticketsSoldToday *= 3;
		dailyProfit = ticketsSoldToday * game.miscData.ticketPrice;
		weekTicketProfits += dailyProfit;

		// Based on ticket sales, how many snacks were purchased.
		var snackProfit = 0;
		var priceModifier = 1;
		for(var i = 0; i < game.snackData.numOfSnacks; i++)
		{
			var rando = (Math.floor((Math.random() * 10) + 1)) * 0.1; // Keeping snack purchases 10%, 20%...100% of ticket sales.
			snackProfit += rando * ticketsSoldToday * (priceModifier + (i*0.5)); // Each snack is $0.5 more expensive than last.
		}
		dailyProfit += snackProfit;
		weekSnackProfits += snackProfit;

		// Based on ticket sales, how many games were played.
		var gamesProfit = 0;
		var priceModifier = 0.25;
		for(var i = 0; i < game.gameroomData.numOfGames; i++)
		{
			var rando = (Math.floor((Math.random() * 10) + 1)) * 0.1; // Keeping games purchases 10%, 20%...100% of ticket sales.
			gamesProfit += rando * ticketsSoldToday * (priceModifier + (i*0.25)); // Each game is $0.25 more expensive than last.
		}
		dailyProfit += gamesProfit;
		weekGamesProfits += gamesProfit;

		return dailyProfit;
	};
	calculateWeeklyExpenses = function() {
		return  ( basicLeaseRent +
				(game.theaterData.numOfTheaters * (0.75 * game.theaterData.newTheaterPriceMultiplier)) +
				(game.snackData.numOfSnacks * (0.25 * game.snackData.newSnackPriceMultiplier)) +
				(game.gameroomData.numOfGames * (0.25 * game.gameroomData.newGamePriceMultiplier)) +
				(game.employeeData.numOfEmployees * game.employeeData.employeeCostMultiplier) +
				(game.parkingData.parkingLevels * (0.25 * game.parkingData.parkingExpandCost)) +
				(game.miscData.currentPromotionIndex * game.miscData.promotionMultiplier) );
	};
	// Pass one-way data to those dependent on the service.
	return game;
});