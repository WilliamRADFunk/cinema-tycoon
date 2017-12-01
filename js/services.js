cinemaTycoonApp.factory('gameData', ['$http', function($http)
{
	var balance;
	var basicLeaseRent;
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var game = {};
	var promos = ["None", "Newspaper Ad", "Radio Commercial", "TV Commercial", "Celebrity Endorsement"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits;
	var weekSnackProfits;
	var weekGamesProfits;

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
	setup = function()
	{
		balance = 10000;
		basicLeaseRent = 1000;
		weekTicketProfits = 0;
		weekSnackProfits = 0;
		weekGamesProfits = 0;

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
		game.state.isStarted = true;						// Tracks whether player has started or not.
		game.state.isPaused = false;						// Tracks whether player has paused game.
		game.state.isHelp = false;							// Tracks whether player is in help modal.
		game.state.isGameOver = false;						// Tracks whether player is in the end game modal.
		game.state.endGameMsg = "";							// Message displayed to user at end of game.
		game.state.isWin = "";								// Displays 'Win' or 'Lose' at end game.
		game.state.isEvent = true;							// Tracks whether a random event is active on screen.

		game.events = [
			{
				base: 1000,
				eventTitle: 'Mutiny',
				eventMsg: 'Your employees feel underappreciated. There has been talk about unionizing. If you don\'t do something quick they may strike and cut into your profits.',
				eventOptA: 'Fire the malcontents and bring in some new blood.',
				eventOptB: 'Give each employee a number of free tickets for their friends and families.',
				eventOptC: 'Cut their pay across the board, so that they know what underappreciation really feels like.',
				eventOptD: 'Add a fat bonus into everybody\'s check this month.',
				eventAnswerA: 'You fired those you believed to be the ringleaders, but it\'s too late. They\'re striking. When the dust settles you\'re out a total of',
				eventAnswerB: 'Though giving away tickets technically costs you some profit, your employees seem somewhat mullified. You neither gain, nor lose, netting',
				eventAnswerC: 'This heavy handed tactic only fuels the dissatisfaction your employees have been feeling. They go on strike. You\'ve lost',
				eventAnswerD: 'It was a costly move, but it\'s evident you\'re a good boss. The improved morale and performance does boost your customers\' experience and mitigates the expense. You only lose',
				modifierA: -2,
				modifierB: -0,
				modifierC: -4,
				modifierD: -1
			},
			{
				base: 1000,
				eventTitle: 'Embers of Fame',
				modifierA: 4,
				modifierB: 1,
				modifierC: 2,
				modifierD: 3,
				eventMsg: 'The local newspaper is running a story on your fledgling cinema. The reporter asks you what made you want to own a movie theater.',
				eventOptA: 'Conjur up a story about your youth, where movie theaters served as sanctuary against a harsh upbringing.',
				eventOptB: 'Tell them you thought it was a way to get rich quick.',
				eventOptC: 'Insist that every town needs a cinema, and that you were merely stepping up to fill your town\'s need.',
				eventOptD: 'Answer with an enigmatic question. Why do penguins prefer the cold?',
				eventAnswerA: 'People love an underdog. Moved by your tale, they flock in greater numbers. Ticket sales boom for a net gain of',
				eventAnswerB: 'Nobody likes the greedy guy, especially when he boasts. The article, however, brings more attention to your theater. There\'s a net gain of',
				eventAnswerC: 'The town comes out en masse to support a staple of their community. As a result, your profits rise by',
				eventAnswerD: 'Such an odd response has spawned much gossip. Intrgued by your question, more people gravitate toward your establishment, earning you an extra',
			},
			{
				MonetaryBase: 4000,
				modifierA: -3,
				modifierB: -1,
				modifierC: -2,
				modifierD: -4,
				eventMsg: 'One of your employees informs you there\'s a leaky pipe in the men\'s bathroom. He\'s waiting for instructions.',
				eventOptA: 'Tell him not to waste your time with the minutiae when you have a cinema empire to run.',
				eventOptB: 'Have him slide a bucket under the pipe to catch the water. It\'s one more problem on the list of many you can\'t get to right now.',
				eventOptC: 'Instruct him to call a plumber. It\'ll be pricey on short notice, but why risk it.',
				eventOptD: 'Get the employee to repair the leak on his own. Time to earn your pay, minion!',
				eventAnswerA: 'Procrastination rarely leads to positive results. The leak soaked through the floor, ruining part of the foundation. Repairs to renovate cost you',
				eventAnswerB: 'Sometimes the simple solutions are best. The employee peridocially dumps the water out of the bucket. Next day, at regular rates, the plumber fixes your pipe. You only spend',
				eventAnswerC: 'An emergency plumber is pricey. Peace of mind is priceless. The bill sets you back',
				eventAnswerD: 'Not the brightest bulb in the box, your employee lacked the necessary know-how and finesse to fix the pipe. Instead, he turned the leak into a rupture, flooding the cinema. You lost',
			},
			{
				MonetaryBase: 4000,
				modifierA: 1,
				modifierB: 1,
				modifierC: 4,
				modifierD: 0,
				eventMsg: 'Closing up late one night, you discover a a wallet under one of the theater seats with $400 cash inside.',
				eventOptA: 'Pocket the cash and toss the wallet into the lost \'n found box.',
				eventOptB: 'Try to contact the owner to return the wallet, but pocket the cash.',
				eventOptC: 'Try to contact the owner to return the wallet, cash and all.',
				eventOptD: 'Divide the cash among your employees as a surprise bonus.',
				eventAnswerA: 'Your pockets are now heavy...like your conscience. You\'ve gained',
				eventAnswerB: 'You appease your noisy conscience with the notion that the stranger\'s license and credit cards found there way home. You\'ve gained',
				eventAnswerC: 'Holy smokes! Turns out the owner of the wallet owns the local radio station. Impressed with your honesty, he becomes your cinema\'s voice over the airwaves. Ticket sales skyrocket, for a gain of',
				eventAnswerD: 'Rumors spread amongst your patrons to keep one hand on their wallets at all times. Meanwhile, your employees love you. The net difference is',
			},
			{
				MonetaryBase: 2000,
				modifierA: -2,
				modifierB: -4,
				modifierC: -1,
				modifierD: -3,
				eventMsg: 'Scandalous! One of your employees was arrested for selling drugs from behind YOUR snack counter in the cinema lobby. Damage control time.',
				eventOptA: 'Play it off as though you were helping the police all along in catching this dastardly fiend.',
				eventOptB: 'Lawyer up!',
				eventOptC: 'Hire someone twice as charming as your former employee. Maybe people will forget the blackheart.',
				eventOptD: 'Claim it was a frame job. Your employee could never have done anything of the sort. You stand behind them a hundred and ten percent.',
				eventAnswerA: 'Your patrons buy your act, but so do you employees. You notice a distinct drop in efficiency as your hirelings have lost their trust in you. There\'s a net loss of',
				eventAnswerB: 'Gag orders descend on anyone who knows anything about anything. The story dies fast, but the lawyers\' bill blooms. You pay',
				eventAnswerC: 'Not bad. Your patrons like the new kid better than their shifty-eyed predecessor. It takes less time for you patrons to come back. The net loss is only',
				eventAnswerD: 'Though your employees appreciate that you\'ve got their back, your customers think maybe those drugs were merely another item on YOUR menu. It takes a while to regain their trust. It costs you a net',
			},
			{
				MonetaryBase: 3000,
				modifierA: 0,
				modifierB: 3,
				modifierC: 0,
				modifierD: 0,
				eventMsg: 'Someone entered you into a national Movie Expert contest. You make it to the final round, where you\'re given the title of a movie, "Snow Fortress." Which one of these are not in the movie:',
				eventOptA: 'Keeanu Forrester',
				eventOptB: 'Hyperthermia',
				eventOptC: 'Global Warming',
				eventOptD: 'Snow Fortress',
				eventAnswerA: 'Ehhh! Wrong! Keeanu Forrester was the lead actor in the film. Your winnings were',
				eventAnswerB: 'Nice catch! Hyperthermia is a condition involving an EXCESS of body temperature. Hypothermia was present in the movie. You won the grand prize of',
				eventAnswerC: 'Ehhh! Wrong! Global Warming was the catalyst for humanities flight through the frozen wasteland. Your winnings were',
				eventAnswerD: 'Ehhh! Wrong! It\'s the title of the movie. Of course there was a snow fortress. The CGI was mind-blowing. Your winnings were',
			},
			{
				MonetaryBase: 3000,
				modifierA: -2,
				modifierB: -0,
				modifierC: -1,
				modifierD: -4,
				eventMsg: 'The projector went on the fritz mid-movie. People are upset.',
				eventOptA: 'Have them wait an hour in their seats until a technician can fix the projector.',
				eventOptB: 'Apologize, and give them a refund for their purchased tickets.',
				eventOptC: 'Offer one free item from the snack bar, and run a small trivia contest to see who knows their movie facts...until the projector is fixed.',
				eventOptD: 'Tell people tough luck, and hit the road.',
				eventAnswerA: 'People don\'t like to wait around, especially in a dark room surrounded by strangers. This experience decreases tickets sales for a net loss of',
				eventAnswerB: 'Still inconvenienced, your customers at least don\'t feel cheated out of their money. The net loss is',
				eventAnswerC: 'Bellies full, people barely noticed time pass. With the exception of the prizes you handed out, little was lost. Out of pocket expense was',
				eventAnswerD: 'Jaded. Angry. Cheated. It will be awhile before those folks come back. Your decreased ticket sales end up costing you',
			},
			{
				MonetaryBase: 5000,
				modifierA: 0,
				modifierB: 3,
				modifierC: 2,
				modifierD: 1,
				eventMsg: 'The nearby football stadium was rained out on Sunday night. All those people need a dry place to go for entertainment.',
				eventOptA: 'Slam your doors shut! Those folks are soaking wet, they\'ll ruin your cinema with their muddy feet.',
				eventOptB: 'Slip the stadium announcer a few bucks to direct people your way.',
				eventOptC: 'Drive around telling people that going to a movie on a rainy day is great.',
				eventOptD: 'Turn the cinema lights on bright. If they can see it, they will come.',
				eventAnswerA: 'Whew! Saved yourself a lot of extra cleanup time. Of course, you didn\'t sell any extra tickets, earning you',
				eventAnswerB: 'You had to turn people away they wanted in so bad. You earned an extra',
				eventAnswerC: 'Not the best method to getting the word out there, but you did increase ticket sales a little for a total of',
				eventAnswerD: 'Unfortunately, the heavy rain made your lights hard to see. Only those who thought of it on their own swung by, earning you an extra',
			},
			{
				MonetaryBase: 5000,
				modifierA: -3,
				modifierB: -1,
				modifierC: -2,
				modifierD: -0,
				eventMsg: 'A little old lady slipped on a wet spot in your front lobby, breaking a hip.',
				eventOptA: 'Go on the defensive with a smear compaign, telling people she\'s one of those ambulance chasers looking for a free-ride.',
				eventOptB: 'Visit her in the hospital, and offer her a lifetime of free tickets and popcorn.',
				eventOptC: 'Have your lawyer talk to her lawyer, and offer up a settlement to keep her from suing you.',
				eventOptD: 'Tell her you\'re hosting a movie night in her name. You\'ll be naming the theater of her choice after her.',
				eventAnswerA: 'You\'ve made it go from bad to worse. She had no intention of suing...until now. Legal fees cost you',
				eventAnswerB: 'Touched by your concern, she won\'t be suing you. Your customers, however, question the safety of your theaters. Ticket sales take a hit for',
				eventAnswerC: 'Settlement accepted! Sadly, the insurance didn\'t cover it. You paid out of pocket at total of',
				eventAnswerD: 'Unfortunate circumstances have transformed into an enjoyable event. People\'s concerns for your theaters safety are negated by the festivities. You lose',
			},
			{
				MonetaryBase: 1000,
				modifierA: 0,
				modifierB: 2,
				modifierC: 4,
				modifierD: 3,
				eventMsg: 'A local church sent representatives to ask your business for donations to use as prizes for their BBQ raffle.',
				eventOptA: 'Tell them to shove off. You\'re here to make money.',
				eventOptB: 'Supply them with a few dozen free tickets.',
				eventOptC: 'Give them coupons to the snack counter for a percentage off purchases.',
				eventOptD: 'Have T-Shirts made with your cinema\'s name and logo on it.',
				eventAnswerA: 'Forgetting that the local church is a place of worship for many of your usual patrons, you lose out on a valuable opportunity. Neither win, nor lose, you get',
				eventAnswerB: 'They were a hit with the crowd. Calculating the lose of the tickets themselves, you gained an extra',
				eventAnswerC: 'You sneaky devil. Not only did you get them to buy more tickets, they still had to partially pay for the snacks. You gained',
				eventAnswerD: 'The church\'s representatives weren\'t exactly impressed with you donation, but they accepted it. After taking into account the cost of the shirts, you gained',
			},
		];
		game.currentEvent = game.events[0];

		game.timeData = {};
		game.timeData.day = 1;								// Tracks the day of the year.
		game.timeData.seasonIndex = 0;						// Enum index for season. (relevant for movie effectiveness)
		game.timeData.season =
			season[game.timeData.seasonIndex];				// The current season in enum value.
		game.timeData.year = 1;								// Total years user has been playing.

		game.workshop = {};
		game.workshop.warningText = "";						// Unique warning text for the workshop module (async failures).
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
			if( cost <= (balance + 9990))
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
			if( cost <= (balance + 9990))
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
			if( cost <= (balance + 9990))
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
			if( cost <= (balance + 9990))
			{
				game.snackData.numOfSnacks++;
				balance -= cost;
			}
		}
	};
	// Since salon object has seat quantity and balance checker, buy and adjust totalSeats.
	game.buySeats = function(salonNum, quantity)
	{
		balance = game.salonData.salonsOwned[salonNum].addSeats(quantity, (balance + 9990));
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
	// Changes event mode
	game.event = function(event)
	{
		game.state.isEvent = event;
	};
	// Gets player's bank balance.
	game.getBalance = function()
	{
		return balance;
	};
	// Picks the result matching player's decision to a random event notification.
	game.getEventResult = function(choice)
	{
		var gainOrLossAmount = (game.currentEvent['modifier' + choice] * game.currentEvent['base']);
		// Event record can handle the positive or negative change to bank.
		balance += gainOrLossAmount;
		if(gainOrLossAmount < 0)
		{
			gainOrLossAmount = ' -$ ' + Math.abs(gainOrLossAmount);
		}
		else
		{
			gainOrLossAmount = ' $ ' + gainOrLossAmount;
		}
		return game.currentEvent.selectedResult =
			game.currentEvent['eventAnswer' + choice] + gainOrLossAmount;
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
		// Only happens if game isn't over
		if(game.state.isGameOver)
		{
			return;
		}
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
			game.state.endGameMsg = "The game was won in " + (game.timeData.day + (365 * (game.timeData.year - 1))) + " days!";
		}
		else if(balance < -10000 || game.timeData.year >= 4)
		{
			// TODO: Activate modal for user endgame.
			game.state.isGameOver = true;
			game.state.isWin = "Lose";
			game.state.endGameMsg = "The game was lost in " + (game.timeData.day + (365 * (game.timeData.year - 1))) + " days!";
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
			if(game.miscData.moviesAvailable[index].getCostLicense() <= (balance + 9990))
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
		balance = game.salonData.salonsOwned[salonNum].upgradeProjectorLevel((balance + 9990));
	};
	game.upgradeScreen = function(salonNum)
	{
		balance = game.salonData.salonsOwned[salonNum].upgradeScreenLevel((balance + 9990));
	};
	game.upgradeSound = function(salonNum)
	{
		balance = game.salonData.salonsOwned[salonNum].upgradeSoundLevel((balance + 9990));
	};
	// Adds a user created movie to the database iff balance available and content passes inspection.
	// Upon success, transfer movie into user's owned licenses.
	game.produceMovie = function(title, synopsis, optimalSeason, worstSeason, cost, licenseDuration, producer)
	{
		if((balance + 9990) < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) game.workshop.warningText = "Movie production failed. You need more money!";
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
	// Resets all of game's variables to brand new conditions.
	game.restartGame = function()
	{
		setup();
		return game;
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

	setup();
	// Pass one-way data to those dependent on the service.
	return game;
}]);