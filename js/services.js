cinemaTycoonApp.factory('gameData', ['$http', function($http)
{
	var balance = 10000000;
	var basicLeaseRent = 1000;
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var game = {};
	var promos = ["None", "Newspaper Ad", "Radio Commercial", "TV Commercial", "Celebrity Endorsement"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits = 0;
	var weekSnackProfits = 0;
	var weekGamesProfits = 0;

	game.employeeData = {};
	game.employeeData.numOfEmployees = 1;				// Player's current number of employed workers.
	game.employeeData.maxEmployees = 5;					// Maximum number of employees possible.
	game.employeeData.employeeResult = employ[0];		// Description of employee amount.
	game.employeeData.employeeCostMultiplier = 500;		// Multiplier for employees on payday.

	game.gameroomData = {};
	game.gameroomData.numOfGames = 0;					// Player's total existing game choices.
	game.gameroomData.maxGames = 5;						// Maximum number of games possible.
	game.gameroomData.newGamePriceMultiplier = 1000;	// Multiplier for additional games.

	game.miscData = {};
	game.miscData.ticketPrice = 10.00;					// Price of a movie ticket.
	game.miscData.currentPromotionIndex = 0;			// Enum index for marketing promotion.
	game.miscData.currentPromotion =
		promos[game.miscData.currentPromotionIndex];	// Enum value for marketing promotion.
	game.miscData.promotionMultiplier = 500;			// Multiplier for marketing promotions.
	game.miscData.numOfLicenses = 0;					// Total number of movie licenses currently owned.
	game.miscData.moviesOwned = [];						// List of movie objects player currently owns.
	game.miscData.moviesAvailable = [];					// Periodically changed. Movies for license purchase.
	game.miscData.movieProductionModifier = 250000;		// Modifier for cost of film making.
	game.miscData.moviesMade = 0;						// User made movies. Needed for the win.
	
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

	game.state = {};
	game.state.isStarted = false;						// Tracks whether player has started or not.
	game.state.isPaused = false;						// Tracks whether player has paused game.
	game.state.isHelp = false;							// Tracks whether player is in help modal.
	game.state.isGameOver = false;						// Tracks whether player is in the end game modal.
	game.state.endGameMsg = "";							// Message displayed to user at end of game.
	game.state.isWin = "";								// Displays 'Win' or 'Lose' at end game.

	game.timeData = {};
	game.timeData.day = 1;								// Tracks the day of the year.
	game.timeData.seasonIndex = 0;						// Enum index for season. (relevant for movie effectiveness)
	game.timeData.season =
		season[game.timeData.seasonIndex];				// The current season in enum value.
	game.timeData.year = 1;								// Total years user has been playing.

	game.workshop = {};
	game.workshop.warningText = "";						// Unique warning text for the workshop module (async failures).

	calculateDailyProfits = function()
	{
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
	calculateTotalSeats = function()
	{
		var totalSeats = 0;
		for(var i = 0; i < game.salonData.salonsOwned.length; i++)
		{
			totalSeats += game.salonData.salonsOwned[i].getSeats();
		}
		return totalSeats;
	};
	calculateWeeklyExpenses = function()
	{
		return  ( basicLeaseRent +
				(game.salonData.numOfSalons * (0.75 * game.salonData.newSalonPriceMultiplier)) +
				(game.snackData.numOfSnacks * (0.25 * game.snackData.newSnackPriceMultiplier)) +
				(game.gameroomData.numOfGames * (0.25 * game.gameroomData.newGamePriceMultiplier)) +
				(game.employeeData.numOfEmployees * game.employeeData.employeeCostMultiplier) +
				(game.parkingData.parkingLevels * (0.25 * game.parkingData.parkingExpandCost)) +
				(game.miscData.currentPromotionIndex * game.miscData.promotionMultiplier) );
	};
	// Adds an extra employee to the cinema.
	game.addEmployee = function()
	{
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
	// Adds a game iff player has the money.
	game.addGame = function()
	{
		if(game.gameroomData.numOfGames >= game.gameroomData.maxGames)
		{
			game.gameroomData.numOfGames = game.gameroomData.maxGames;
		}
		else
		{
			var cost = (game.gameroomData.numOfGames + 1) * game.gameroomData.newGamePriceMultiplier;
			if( cost <= balance)
			{
				game.gameroomData.numOfGames++;
				balance -= cost;
			}
		}
	};
	// Adds extra parking iff player has the money.
	game.addParking = function()
	{
		if(game.parkingData.parkingLevels >= game.parkingData.maxParkingLevels)
		{
			game.parkingData.parkingLevels = game.parkingData.maxParkingLevels;
		}
		else
		{
			var cost = (game.parkingData.parkingLevels + 1) * game.parkingData.parkingExpandCost;
			if( cost <= balance)
			{
				game.parkingData.parkingLevels++;
				balance -= cost;
			}
		}
	};
	// Adds a salon iff player has the money.
	game.addSalon = function()
	{
		if(game.salonData.numOfSalons >= game.salonData.maxSalons)
		{
			game.salonData.numOfSalons = game.salonData.maxSalons;
			return false;
		}
		else
		{
			var cost = (game.salonData.numOfSalons + 1) * game.salonData.newSalonPriceMultiplier;
			if( cost <= balance)
			{
				var salon = createSalon();
				game.salonData.salonsOwned.push(salon);
				game.salonData.numOfSalons = game.salonData.salonsOwned.length;
				game.salonData.totalSeats = calculateTotalSeats();
				balance -= cost;
				return true;
			}
			else return false;
		}
	};
	// Adds a snack iff player has the money.
	game.addSnack = function()
	{
		if(game.snackData.numOfSnacks >= game.snackData.maxSnacks)
		{
			game.snackData.numOfSnacks = game.snackData.maxSnacks;
		}
		else
		{
			var cost = (game.snackData.numOfSnacks + 1) * game.snackData.newSnackPriceMultiplier;
			if( cost <= balance)
			{
				game.snackData.numOfSnacks++;
				balance -= cost;
			}
		}
	};
	// Since salon object has seat quantity and balance checker, buy and adjust totalSeats.
	game.buySeats = function(salonNum, quantity)
	{
		balance = game.salonData.salonsOwned[salonNum].addSeats(quantity, balance);
		game.salonData.totalSeats = calculateTotalSeats();
	};
	// Changes the movie playing in this salon
	game.changeMoviePlaying = function(salonNum, movieIndex)
	{
		if(movieIndex === undefined || movieIndex === null) return;
		else if(movieIndex === 0) game.salonData.salonsOwned[salonNum].setMoviePlaying(0);
		else game.salonData.salonsOwned[salonNum].setMoviePlaying(game.miscData.moviesOwned[movieIndex]);
	}
	// Changes the chosen promotion.
	game.changePromo = function(index)
	{
		if(index < 0 || index >= promos.length) return; // In case someone sneaks a bad index through.
		game.miscData.currentPromotionIndex = index;
		game.miscData.currentPromotion = promos[game.miscData.currentPromotionIndex];
	};
	// Gets player's bank balance.
	game.getBalance = function()
	{
		return balance;
	};
	// Gets index number in moviesOwned for movie playing in this salon.
	game.getMoviePlayingIndex = function(salonNum)
	{
		var movie = game.salonData.salonsOwned[salonNum].getMoviePlaying();
		var title = "";
		if(movie === null) return 0;
		else title = movie.getTitle();
		for(var i = 0; i < game.miscData.moviesOwned.length; i++)
		{
			if(title === game.miscData.moviesOwned[i].getTitle()) return i;
		}
	};
	// Returns the promotion array for display.
	game.getPromos = function()
	{
		return promos;
	};
	// Gets the string season from index.
	game.getSeason = function(index)
	{
		return season[index];
	};
	// Changes help mode
	game.help = function(help)
	{
		game.state.isHelp = help;
	};
	// Updates the reduction of ticket price for entire game.
	game.lowerTicketPrice = function()
	{
		game.miscData.ticketPrice -= 0.10;
		if(game.miscData.ticketPrice <= 0) game.miscData.ticketPrice = 0.0;
	};
	// Main time-keeping function that serves as a simple game loop.
	game.newDay = function()
	{
		// Calculates profits every day.
		var profits = calculateDailyProfits();
		balance += profits;
		// Calculates expenses every week, and modifies HUD for weekly expense & profit.
		if(game.timeData.day % 7 === 0)
		{
			basicLeaseRent += 10;
			var expenses = calculateWeeklyExpenses();
			game.profitData.expenses = expenses;
			balance -= expenses;
			game.profitData.profitTicketSales = weekTicketProfits;
			game.profitData.profitSnackSales = weekSnackProfits;
			game.profitData.profitGamesSales = weekGamesProfits;
			game.profitData.netProfit = weekTicketProfits + weekSnackProfits + weekGamesProfits - expenses;
			weekTicketProfits = 0;
			weekSnackProfits = 0;
			weekGamesProfits = 0;
			removeExpiredLicenses();
		}
		// Every 90 days, refresh available licenses for purchase.
		if(game.timeData.day % 90 === 0) getNewMovies();
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
		// Checks to see if user has won or lost
		if(balance >= 1000000 && game.miscData.moviesMade >= 3)
		{
			// TODO: Activate modal for user to enter name for top scores.
			game.state.isGameOver = true;
			game.state.isWin = "Win";
			game.state.endGameMsg = "The game was won in " + (game.timeData.day * game.timeData.year) + " days!";
		}
		else if(balance < -10000 || game.timeData.year >= 4)
		{
			// TODO: Activate modal for user endgame.
			game.state.isGameOver = true;
			game.state.isWin = "Lose";
			game.state.endGameMsg = "The game was lost in " + (game.timeData.day * game.timeData.year) + " days!";
		}
	};
	// Pauses and unpauses game
	game.pause = function(pause)
	{
		game.state.isPaused = pause;
	};
	// Purchases this movie license, if user has the money.
	// Removes from available after success.
	game.purchaseLicense = function(index)
	{
		if(index !== 0)
		{
			if(game.miscData.moviesAvailable[index].getCostLicense() <= balance)
			{
				balance -= game.miscData.moviesAvailable[index].getCostLicense();
				game.miscData.moviesOwned.push(game.miscData.moviesAvailable[index]);
				game.miscData.moviesAvailable.splice(index, 1);
				return true;
			}
			else return false;
		}
	};
	// Updates the increase of ticket price for entire game.
	game.raiseTicketPrice = function()
	{
		game.miscData.ticketPrice += 0.10;
		if(game.miscData.ticketPrice >= 100) game.miscData.ticketPrice = 100.0;
	};
	game.upgradeProjector = function(salonNum)
	{
		balance = game.salonData.salonsOwned[salonNum].upgradeProjectorLevel(balance);
	};
	game.upgradeScreen = function(salonNum)
	{
		balance = game.salonData.salonsOwned[salonNum].upgradeScreenLevel(balance);
	};
	game.upgradeSound = function(salonNum)
	{
		balance = game.salonData.salonsOwned[salonNum].upgradeSoundLevel(balance);
	};
	// Adds a user created movie to the database iff balance available and content passes inspection.
	// Upon success, transfer movie into user's owned licenses.
	game.produceMovie = function(title, synopsis, optimalSeason, worstSeason, cost, licenseDuration, producer)
	{
		if(balance < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) game.workshop.warningText = "Movie production failed. You need more money!";
		else
		{
			// Randomly select popularity.
			var actualPopularity = Math.floor(Math.random() * 10 + 1) / 10.0;
			var expectedPopularity = Math.floor(Math.random() * 10 + 1) / 10.0;
			// Validate cost input.
			if(cost < 1000) cost = 1000;
			else if(cost > 100000) cost = 100000;
			// Validate license duration input.
			if(licenseDuration < 12) licenseDuration = 12;
			else if(licenseDuration > 52) licenseDuration = 52;
			// Validate Optimal Season input.
			if(optimalSeason < 0) optimalSeason = 0;
			else if(optimalSeason > 3) optimalSeason = 3;
			// Validate Worst Season input.
			if(worstSeason < 0) worstSeason = 0;
			else if(worstSeason > 3) worstSeason = 3;
			// Validate title input.
			if(title === "" || title === null || title === undefined) title = "Untitled";
			// Validate synopsis input.
			if(synopsis === "" || synopsis === null || synopsis === undefined) synopsis = "No synopsis given.";
			// Validate producer input.
			if(producer === "" || producer === null || producer === undefined) producer = "Anonymous";

			$http(
			{
				method: 'POST',
				headers: {
	              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
				},
				crossDomain: true,
				async: true,
				url: 'https://tenaciousteal.com/games/cinema-tycoon/actions/createMovie.php',
				data:
				{
					actualPopularity: actualPopularity,
					costLicense: cost,
					expectedPopularity: expectedPopularity,
					licenseLength: licenseDuration,
					optimalSeason: optimalSeason,
					producedBy: producer,
					synopsis: synopsis,
					title: title,
					worstSeason: worstSeason
				}
			}).then(function successCallback(response)
			{
				if(response.data.title === undefined) game.workshop.warningText = "Movie production failed. Connection Problems?";
				else
				{
					response.data.licenseLength = 5200;
					game.miscData.moviesOwned.push(createMovie(	response.data.title,
																response.data.synopsis,
																response.data.expectedPopularity,
																response.data.actualPopularity,
																response.data.optimalSeason,
																response.data.worstSeason,
																response.data.costLicense,
																response.data.licenseLength,
																response.data.producedBy
					));
					game.miscData.moviesMade++;
					game.workshop.warningText = "";
				}
			}, function errorCallback(response)
			{
				console.log(response);
				game.workshop.warningText = "Movie production failed. Connection Problems?";
			});
		}
	};
	// Removes an employee from the cinema.
	game.removeEmployee = function()
	{
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
	// Starts game
	game.startGame = function(speed)
	{
		game.state.isStarted = true;
		getNewMovies();
		game.miscData.moviesOwned.push(createMovie("No Movie Selected"));
		game.miscData.numOfLicenses = game.miscData.moviesOwned.length - 1;
	};
	// Allows controller to update warning text without losing track of service warning text.
	game.updateWarningText = function(module, msg)
	{
		game[module].warningText = msg;
	};
	// Called at game start and at regular time intervals (~90 days)
	// Gets three movies to refresh the "available for license purchase" array.
	getNewMovies = function()
	{
		$http(
		{
			method: 'GET',
			dataType:'json',
			crossDomain: true,
			async: true,
			url: 'https://tenaciousteal.com/games/cinema-tycoon/actions/getMovies.php'
		}).then(function successCallback(response)
		{
			game.miscData.moviesAvailable = [];
			game.miscData.moviesAvailable.push(createMovie("No Movie Selected"));
			game.miscData.moviesAvailable.push(createMovie(	response.data.movies[0].title,
														response.data.movies[0].synopsis,
														response.data.movies[0].expectedPopularity,
														response.data.movies[0].actualPopularity,
														response.data.movies[0].optimalSeason,
														response.data.movies[0].worstSeason,
														response.data.movies[0].costLicense,
														response.data.movies[0].licenseLength,
														response.data.movies[0].producedBy
														));
			game.miscData.moviesAvailable.push(createMovie(	response.data.movies[1].title,
														response.data.movies[1].synopsis,
														response.data.movies[1].expectedPopularity,
														response.data.movies[1].actualPopularity,
														response.data.movies[1].optimalSeason,
														response.data.movies[1].worstSeason,
														response.data.movies[1].costLicense,
														response.data.movies[1].licenseLength,
														response.data.movies[1].producedBy
														));
			game.miscData.moviesAvailable.push(createMovie(	response.data.movies[2].title,
														response.data.movies[2].synopsis,
														response.data.movies[2].expectedPopularity,
														response.data.movies[2].actualPopularity,
														response.data.movies[2].optimalSeason,
														response.data.movies[2].worstSeason,
														response.data.movies[2].costLicense,
														response.data.movies[2].licenseLength,
														response.data.movies[2].producedBy
														));
		}, function errorCallback(response)
		{
			console.log(response);
			setTimeout(getNewMovies(), 3000);
		});
	};
	// Decrements all licenses by one, and removes those with 0 weeks remaining.
	removeExpiredLicenses = function()
	{
		for(var i = 1; i < game.miscData.moviesOwned.length; i++)
		{
			game.miscData.moviesOwned[i].decrementLicense();
			if(game.miscData.moviesOwned[i].getLicenseLength() <= 0) game.miscData.moviesOwned.splice(i, 1);
		}
	};
	// Pass one-way data to those dependent on the service.
	return game;
}]);