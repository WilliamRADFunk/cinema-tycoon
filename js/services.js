cinemaTycoonApp.factory('gameData', function(){
	var game = {};
	var basicLeaseRent = 1000;
	var promos = ["None", "Newspaper Ad", "Radio Commercial", "TV Commercial", "Celebrity Endorsement"];
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits = 0;
	var weekSnackProfits = 0;
	var weekGamesProfits = 0;

	game.state = {};
	game.state.isStarted = false;						// Tracks whether player has started or not.
	game.state.isPaused = false;						// Tracks whether player has paused game.
	game.state.isHelp = false;							// Tracks whether player is in help modal.

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
		promos[game.miscData.currentPromotionIndex];		// Enum value for marketing promotion.
	game.miscData.promotionMultiplier = 500;			// Multiplier for marketing promotions.
	game.miscData.numOfLicenses = 1;					// Total number of movie licenses currently owned.

	game.salonData = {};
	game.salonData.salonsOwned = [];					// Contains the actual salon objects.
	game.salonData.numOfSalons =
		game.salonData.salonsOwned.length;				// Player's total existing salons.
	game.salonData.maxSalons = 10;						// Maximum number of salons possible.
	game.salonData.newSalonPriceMultiplier = 1000;		// Multiplier for additional salons.
	game.salonData.totalSeats = 0;						// Total seats (possible tickets) cinema has.	

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
	game.profitData.expenses = 0.0;						// Total cost of running cinema in last period.
	game.profitData.netProfit = 0.0;					// Total profit/loss for the last period.

	// Starts game
	game.startGame = function(speed) {
		game.state.isStarted = true;
	};
	// Pauses and unpauses game
	game.pause = function(pause) {
		game.state.isPaused = pause;
		console.log("game is paused: " + game.state.isPaused);
	};
	// Changes help mode
	game.help = function(help) {
		game.state.isHelp = help;
		console.log("need help: " + game.state.isHelp);
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
	// Adds a salon iff player has the money.
	game.addSalon = function() {
		if(game.salonData.numOfSalons >= game.salonData.maxSalons)
		{
			game.salonData.numOfSalons = game.salonData.maxSalons;
			return false;
		}
		else
		{
			var cost = (game.salonData.numOfSalons + 1) * game.salonData.newSalonPriceMultiplier;
			if( cost <= game.miscData.balance)
			{
				var salon = createSalon();
				game.salonData.salonsOwned.push(salon);
				game.salonData.numOfSalons = game.salonData.salonsOwned.length;
				game.salonData.totalSeats = calculateTotalSeats();
				game.miscData.balance -= cost;
				return true;
			}
			else return false;
		}
	};
	// Since salon object has seat quantity and balance checker, buy and adjust totalSeats.
	game.buySeats = function(salonNum, quantity) {
		game.miscData.balance = game.salonData.salonsOwned[salonNum].addSeats(quantity, game.miscData.balance);
		game.salonData.totalSeats = calculateTotalSeats();
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
	// Returns the promotion array for display.
	game.getPromos = function() {
		return promos;
	};
	// Changes the chosen promotion.
	game.changePromo = function(index) {
		if(index < 0 || index >= promos.length) return; // In case someone sneaks a bad index through.
		game.miscData.currentPromotionIndex = index;
		game.miscData.currentPromotion = promos[game.miscData.currentPromotionIndex];
		console.log("index: " + game.miscData.currentPromotionIndex);
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
	// Adds an extra employee to the cinema.
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
	// Removes an employee from the cinema.
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
		// Promotions encourage patronage.
		dailyPatronModifier += game.miscData.currentPromotionIndex * 0.01;
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
		// Now to apply modifier to the available seats in all salons.
		var ticketsSoldToday = 0;
		for(var i = 0; i < game.salonData.salonsOwned.length; i++)
		{
			ticketsSoldToday += game.salonData.salonsOwned[i].getTicketsSold(dailyPatronModifier, game.timeData.seasonIndex);
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
				(game.salonData.numOfSalons * (0.75 * game.salonData.newSalonPriceMultiplier)) +
				(game.snackData.numOfSnacks * (0.25 * game.snackData.newSnackPriceMultiplier)) +
				(game.gameroomData.numOfGames * (0.25 * game.gameroomData.newGamePriceMultiplier)) +
				(game.employeeData.numOfEmployees * game.employeeData.employeeCostMultiplier) +
				(game.parkingData.parkingLevels * (0.25 * game.parkingData.parkingExpandCost)) +
				(game.miscData.currentPromotionIndex * game.miscData.promotionMultiplier) );
	};
	calculateTotalSeats = function() {
		var totalSeats = 0;
		for(var i = 0; i < game.salonData.salonsOwned.length; i++)
		{
			totalSeats += game.salonData.salonsOwned[i].getSeats();
		}
		return totalSeats;
	};
	// Pass one-way data to those dependent on the service.
	return game;
});