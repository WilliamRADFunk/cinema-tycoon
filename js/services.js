cinemaTycoonApp.factory('gameData', ['$http', '$rootScope', function($http, $rootScope)
{
	var balance;
	var basicLeaseRent;
	var employ = ["Dismal", "Substandard", "Decent", "Friendly", "Super"];
	var game = {};
	game.state = {};
	var promos = ["None", "Newspaper Ad", "Radio Commercial", "TV Commercial", "Celebrity Endorsement"];
	var season = ["Winter", "Spring", "Summer", "Autumn"];
	var weekTicketProfits;
	var weekSnackProfits;
	var weekGamesProfits;
	var randomEventSpawnCounter = 0;
	var resourcesLoaded = 0;

	game.sounds = {};
	/*
	 * Title: Cha Ching Register
	 * Author: Muska666
	 * Download Source: http://soundbible.com/1997-Cha-Ching-Register.html
	 * License: Attribution 3.0
	 */
	game.sounds.chaChingSound = new Audio('./sounds/cha-ching.mp3');
	game.sounds.chaChingSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('chaChingSound');
	});
	game.sounds.chaChingSound.volume = 0.4;
	/*
	 * Title: Flyby
	 * Author: Conor
	 * Download Source: http://soundbible.com/1891-Flyby.html
	 * License: Attribution 3.0
	 */
	game.sounds.spawnEventSound = new Audio('./sounds/spawn-event.mp3');
	game.sounds.spawnEventSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('spawnEventSound');
	});
	game.sounds.spawnEventSound.volume = 0.4;
	 /*
	 * Title: Climactic Suspense
	 * Author: Mike Koenig
	 * Download Source: http://soundbible.com/1832-Climactic-Suspense.html
	 * License: Attribution 3.0
	 */
	game.sounds.eventRevealSound = new Audio('./sounds/event-reveal.mp3');
	game.sounds.eventRevealSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('eventRevealSound');
	});
	game.sounds.eventRevealSound.volume = 0.4;
	 /*
	 * Title: Horn Honk
	 * Author: Mike Koenig
	 * Download Source: http://soundbible.com/1048-Horn-Honk.html
	 * License: Attribution 3.0
	 */
	game.sounds.parkingLotSound = new Audio('./sounds/horn-honk.mp3');
	game.sounds.parkingLotSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('parkingLotSound');
	});
	game.sounds.parkingLotSound.volume = 0.1;
	/*
	 * Title: Pouring Hot Tea
	 * Author: Cori Samuel
	 * Download Source: http://soundbible.com/1244-Pouring-Hot-Tea.html
	 * License: Public Domain
	 */
	game.sounds.snackDrinkSound = new Audio('./sounds/concession-drink.mp3');
	game.sounds.snackDrinkSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('snackDrinkSound');
	});
	game.sounds.snackDrinkSound.volume = 0.4;
	 /*
	 * Title: Popcorn Popping
	 * Author: KevanGC
	 * Download Source: http://soundbible.com/1710-Popcorn-Popping.html
	 * License: Public Domain
	 */
	game.sounds.snackPopcornSound = new Audio('./sounds/concession-popcorn.mp3');
	game.sounds.snackPopcornSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('snackPopcornSound');
	});
	game.sounds.snackPopcornSound.volume = 0.4;
	/*
	 * Title: Opening Casket
	 * Author: Mike Koenig
	 * Download Source: http://soundbible.com/1354-Opening-Casket.html
	 * License: Attribution 3.0
	 */
	game.sounds.vaultDoorSound = new Audio('./sounds/vault-door.mp3');
	game.sounds.vaultDoorSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('vaultDoorSound');
	});
	game.sounds.vaultDoorSound.volume = 0.6;
	/*
	 * Title: Blop
	 * Author: Mark DiAngelo
	 * Download Source: http://soundbible.com/2067-Blop.html
	 * License: Attribution 3.0
	 */
	game.sounds.buttonBlopSound = new Audio('./sounds/blop.mp3');
	game.sounds.buttonBlopSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('buttonBlopSound');
	});
	/*
	 * Title: Gun Silencer
	 * Author: Mike Koenig
	 * Download Source: http://soundbible.com/930-Gun-Silencer.html
	 * License: Attribution 3.0
	 */
	game.sounds.deniedSound = new Audio('./sounds/denied.mp3');
	game.sounds.deniedSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('deniedSound');
	});
	game.sounds.deniedSound.volume = 0.8;
	/*
	 * Title: Close Door
	 * Author: Caroline Ford
	 * Download Source: http://soundbible.com/875-Close-Door.html
	 * License: Attribution 3.0
	 */
	game.sounds.doorSound = new Audio('./sounds/close-door.mp3');
	game.sounds.doorSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('doorSound');
	});
	game.sounds.doorSound.volume = 0.6;
	/*
	 * Title: Cash Register Fake
	 * Author: CapsLok
	 * Download Source: https://freesound.org/people/CapsLok/sounds/184438/
	 * License: Public Domain
	 */
	game.sounds.cashRegisterSound = new Audio('./sounds/cash-register.wav');
	game.sounds.cashRegisterSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('cashRegisterSound');
	});
	game.sounds.cashRegisterSound.volume = 0.8;
	/*
	 * Title: Retro arcade video game descending, crazy lose life tone
	 * Author: alanmcki
	 * Download https://freesound.org/people/alanmcki/sounds/400582/
	 * License: Attribution 3.0
	 */
	game.sounds.arcadeSound = new Audio('./sounds/arcade.wav');
	game.sounds.arcadeSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('arcadeSound');
	});
	game.sounds.arcadeSound.volume = 0.3;
	/*
	 * Title: chattering crowd 2
	 * Author: cognito perceptu
	 * Download https://freesound.org/people/cognito%20perceptu/sounds/266192/
	 * License: Public Domain
	 */
	game.sounds.chatterSound = new Audio('./sounds/chatter.mp3');
	game.sounds.chatterSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('chatterSound');
	});
	game.sounds.chatterSound.volume = 0.5;
	/*
	 * Title: badass
	 * Author: bensound
	 * Download https://www.bensound.com/royalty-free-music/track/badass
	 * License: FREE Creative Commons License
	 */
	game.sounds.themeSound = new Audio('./sounds/bensound-badass.mp3');
	game.sounds.themeSound.addEventListener('loadeddata', function(e) {
		// checkLoaded('themeSound');
	});
	game.sounds.themeSound.volume = 0.1;
	game.sounds.themeSound.loop = true;
	game.sounds.themeSound.play();
	

	// var checkLoaded = function(sound) {
	// 	resourcesLoaded += game.sounds[sound].readyState;
	// 	if(resourcesLoaded >= 60)
	// 	{
	// 		game.state.isLoading = false;
	// 		// $rootScope.$digest();
	// 	}		
	// };
	var calculateDailyProfits = function()
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
	var calculateTotalSeats = function()
	{
		var totalSeats = 0;
		for(var i = 0; i < game.salonData.salonsOwned.length; i++)
		{
			totalSeats += game.salonData.salonsOwned[i].getSeats();
		}
		return totalSeats;
	};
	var calculateWeeklyExpenses = function()
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
	var getNewMovies = function(firstTime)
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
			if(firstTime)
			{
				game.state.isLoading = false;	
			}
		}, function errorCallback(response)
		{
			console.log(response);
			setTimeout(getNewMovies(), 3000);
		});
	};
	// Makes sure to pause and reset sound before playing.
	var playSound = function(sound)
	{
		if(sound)
		{
			game.sounds[sound].pause();
			game.sounds[sound].currentTime = 0;
			game.sounds[sound].play();
		}
	};
	// Decides whether to spawn a random event. If so, if picks one from the list.
	var randomEventSpawn = function()
	{
		randomEventSpawnCounter++;
		if(randomEventSpawnCounter < 8)
		{
			return;
		}
		if(Math.random() <= 0.20 && !game.state.isEvent)
		{
			$rootScope.$broadcast('event');
			var i = 0;
			do
			{
				i = Math.floor(Math.random() * game.events.length);
				if(game.currentEvent.eventTitle !== game.events[i].eventTitle)
				{
					game.currentEvent.base = game.events[i].base;
					game.currentEvent.eventTitle = game.events[i].eventTitle;
					game.currentEvent.modifierA = game.events[i].modifierA;
					game.currentEvent.modifierB = game.events[i].modifierB;
					game.currentEvent.modifierC = game.events[i].modifierC;
					game.currentEvent.modifierD = game.events[i].modifierD;
					game.currentEvent.eventMsg = game.events[i].eventMsg;
					game.currentEvent.eventOptA = game.events[i].eventOptA;
					game.currentEvent.eventOptB = game.events[i].eventOptB;
					game.currentEvent.eventOptC = game.events[i].eventOptC;
					game.currentEvent.eventOptD = game.events[i].eventOptD;
					game.currentEvent.eventAnswerA = game.events[i].eventAnswerA;
					game.currentEvent.eventAnswerB = game.events[i].eventAnswerB;
					game.currentEvent.eventAnswerC = game.events[i].eventAnswerC;
					game.currentEvent.eventAnswerD = game.events[i].eventAnswerD;
					game.currentEvent.choice = 'A';
					game.state.isEvent = true;
					break;
				}
			} while(true);
			playSound('spawnEventSound');
			randomEventSpawnCounter = 0;
		}
	};
	// Decrements all licenses by one, and removes those with 0 weeks remaining.
	var removeExpiredLicenses = function()
	{
		for(var i = 1; i < game.miscData.moviesOwned.length; i++)
		{
			game.miscData.moviesOwned[i].decrementLicense();
			if(game.miscData.moviesOwned[i].getLicenseLength() <= 0) game.miscData.moviesOwned.splice(i, 1);
		}
	};
	var setup = function()
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

		if(game.state.isLoading === undefined)
		{
			game.state.isLoading = true;					// Tracks if initial assets are still loading.
		}
		game.state.isStarted = false;						// Tracks whether player has started or not.
		game.state.isPaused = true;						// Tracks whether player has paused game.
		game.state.isHelp = false;							// Tracks whether player is in help modal.
		game.state.isGameOver = false;						// Tracks whether player is in the end game modal.
		game.state.endGameMsg = "";							// Message displayed to user at end of game.
		game.state.isWin = "";								// Displays 'Win' or 'Lose' at end game.
		game.state.isEvent = false;							// Tracks whether a random event is active on screen.

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
				eventAnswerD: 'Such an odd response has spawned much gossip. Intrgued by your question, more people gravitate toward your establishment, earning you an extra'
			},
			{
				base: 4000,
				eventTitle: 'Leaky Pipe',
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
				eventAnswerD: 'Not the brightest bulb in the box, your employee lacked the necessary know-how and finesse to fix the pipe. Instead, he turned the leak into a rupture, flooding the cinema. You lost'
			},
			{
				base: 4000,
				eventTitle: 'Good Samaritan',
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
				eventAnswerD: 'Rumors spread amongst your patrons to keep one hand on their wallets at all times. Meanwhile, your employees love you. The net difference is'
			},
			{
				base: 2000,
				eventTitle: 'Under The Counter',
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
				eventAnswerD: 'Though your employees appreciate that you\'ve got their back, your customers think maybe those drugs were merely another item on YOUR menu. It takes a while to regain their trust. It costs you a net'
			},
			{
				base: 3000,
				eventTitle: 'All in a Name',
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
				eventAnswerD: 'Ehhh! Wrong! It\'s the title of the movie. Of course there was a snow fortress. The CGI was mind-blowing. Your winnings were'
			},
			{
				base: 3000,
				eventTitle: '...and Cut!',
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
				eventAnswerD: 'Jaded. Angry. Cheated. It will be awhile before those folks come back. Your decreased ticket sales end up costing you'
			},
			{
				base: 5000,
				eventTitle: 'Rainy Day',
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
				eventAnswerD: 'Unfortunately, the heavy rain made your lights hard to see. Only those who thought of it on their own swung by, earning you an extra'
			},
			{
				base: 5000,
				eventTitle: 'Oh Snap!',
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
				eventAnswerD: 'Unfortunate circumstances have transformed into an enjoyable event. People\'s concerns for your theaters safety are negated by the festivities. You lose'
			},
			{
				base: 1000,
				eventTitle: 'Tithes',
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
				eventAnswerD: 'The church\'s representatives weren\'t exactly impressed with you donation, but they accepted it. After taking into account the cost of the shirts, you gained'
			},
			{
				base: 1000,
				eventTitle: 'Frisky Business',
				modifierA: -2,
				modifierB: -4,
				modifierC: -3,
				modifierD: -0,
				eventMsg: 'The local newspaper ran a story on how the teenagers in your community use the cinema as a place to get frisky. Great for selling tickets to teenagers. Not so much to adults.',
				eventOptA: 'Lower the lighting yet further, catering to your new crowd.',
				eventOptB: 'Increase the presence of ushers, checking the back rows with flashlights to halt any hanky panky before it starts.',
				eventOptC: 'Sue the newspaper for slander.',
				eventOptD: 'Adjust the seat arrangements to make the back rows more visibile, discouraging any sordid behavior.',
				eventAnswerA: 'You manage to the numbers of your younger audience, while ostrasizing some of the older folks. The net in ticket sales costs you',
				eventAnswerB: 'There\'s less wandering hands now, but people are annoyed by the constant interruption by your employees. Ticket sales take a hit for',
				eventAnswerC: 'Story redacted. The reputation of your establishment is again along the straight and narrow. Attorney fees cost you',
				eventAnswerD: 'Well played. Unable to get away with the really kinky stuff, those pesky teenagers will have to settle for making out. You net'
			},
			{
				base: 2000,
				eventTitle: 'Papparazzi',
				modifierA: 1,
				modifierB: 3,
				modifierC: 4,
				modifierD: 2,
				eventMsg: 'A supporting actor from one of the flicks you\'re playing swings by, incognito, with a date, to see a movie.',
				eventOptA: 'Play it cool. Actors are people, too. They deserve to have a night out without being pestered.',
				eventOptB: 'Make a big spectacle out of their presence. Make sure people know just who it is that thinks so highly of your establishment.',
				eventOptC: 'Secretly take pictures, and post them online. Let people know celebrities choose your business, without letting the actor know you papparazzied them.',
				eventOptD: 'Have your employees cater to this actor every step of the way. Give them the VIP treatment, but don\'t blabber to anyone about who they are.',
				eventAnswerA: 'You don\'t get a crowd of people trying to catch famous people at the movies, but the actor did slip you a sizeable tip for your discretion. You got',
				eventAnswerB: 'Ticket sales that night went through the roof. You gained an extra',
				eventAnswerC: 'Subtlety is often the best method. You didn\'t burn any bridges, and yet people swarm to your cinema frequently, hoping to catch a glimpse of famous people. Ticket sale climb high for an extra',
				eventAnswerD: 'Ticket sales don\'t explode, but the actor spreads the words to friends and family that you run a tight ship. That increased revenue comes to'
			},
			{
				base: 2000,
				eventTitle: 'Lights Out',
				modifierA: -1,
				modifierB: -2,
				modifierC: -3,
				modifierD: -4,
				eventMsg: 'Bad news! There was a major blackout. Power is out for the entire block.',
				eventOptA: 'Refund everyone\'s money. Surely they can see that matters were out of your control.',
				eventOptB: 'Assure everyone the power will come back shortly. Offer free snacks to those who wait.',
				eventOptC: 'Send an employee to the local hardware store to purchase portable generators.',
				eventOptD: 'Bride a city official to get your power restored first.',
				eventAnswerA: 'Good thinking. The power didn\'t return till the next morning. You lost only',
				eventAnswerB: 'Your assurances were hollow. No power, and now you\'ve lost the snacks and the ticket revenue. Not loss was',
				eventAnswerC: 'Someone made a pretty penny, but it wasn\'t you. You\'ve restored power, but the generators were expensive. You paid',
				eventAnswerD: 'Who knew bribes were so expensive. Though you were the first building to get power restored, your bribe cost'
			},
			{
				base: 3000,
				eventTitle: 'World\'s Tinniest Violin',
				modifierA: 3,
				modifierB: 0,
				modifierC: 1,
				modifierD: 2,
				eventMsg: 'One of your employees, a high school student, asked for your help. They need to raise money to save the music department at school.',
				eventOptA: 'Convince him to sell cinema tickets door-to-door and give him half the proceeds toward the fundraising.',
				eventOptB: 'Tell him he shouldn\'t be bringing his problems to work, and leave you out of it.',
				eventOptC: 'Host a private event in one of your theaters, where the school\'s orchestra can play for an audience. All proceeds go to the fundraiser.',
				eventOptD: 'Let your employee have bake sell in your cinema, selling their baked goods instead of your usual snacks. What they sell, they keep.',
				eventAnswerA: 'Your idea did wonders. The employee sold tons of tickets. Ticket sales jumped for an additional',
				eventAnswerB: 'The employee wandered off looking defeated. You\'re left feeling as though an opportunity has passed you by. You make',
				eventAnswerC: 'On a night where ticket sales are usually pitiful, you\'ve managed to fill some seats. The increase in snack sales netted you',
				eventAnswerD: 'Seeing people with delicious cakes, cookies, and other confectionaries, has brought new folks into the theater. More ticket sales equals an extra'
			},
			{
				base: 3000,
				eventTitle: 'Red Handed',
				modifierA: -1,
				modifierB: -3,
				modifierC: -0,
				modifierD: -2,
				eventMsg: 'It\'s a publicity nightmare! The main actor in one of the films you\'re playing has been found guilty of unspeakable crimes.',
				eventOptA: 'Stop playing the film at once as boycott.',
				eventOptB: 'Keep playing it. It\'s not like the movie has anything to do with the actor\'s questionable behavior.',
				eventOptC: 'Tell your employees to warn those about to buy tickets to that movie. Divorce yourself from any connection to the actor.',
				eventOptD: 'Get into a freedom of speech argument with anybody who complains. Movies are representations of that speech and should not be censored.',
				eventAnswerA: 'Your losses were minimal. With fewer movies available, fewer tickets were sold. You only lost',
				eventAnswerB: 'They\'re boycotting your entire cinema. There\'s even a picket line driving off potential customers. Your revenue loss is',
				eventAnswerC: 'Having neither condemned nor promoted the actor, you neither gained or lost additional revenue. The total comes to',
				eventAnswerD: 'It could have been worse. Though people are boycotting your cinema, you\'ve reduced the number of protestors on the picket line. Ticket sales only suffer a little. You lost'
			},
			{
				base: 4000,
				eventTitle: 'Rich Uncles',
				modifierA: 1,
				modifierB: 0,
				modifierC: 2,
				modifierD: 4,
				eventMsg: 'You\'ve received a windfall. A distant relative whom you\'ve never met, died recently. They left you a sizeable sum of cash.',
				eventOptA: 'Put it straight into the bank. A penny saved is a penny earned.',
				eventOptB: 'Invest it in a risky new technology--a sound system built into each chair.',
				eventOptC: 'Use it to hire a professional cleaning service for the cinema.',
				eventOptD: 'Buy a whole bunch of lottery tickets. If you were lucky enough to get the inheritance, surely it will carry over.',
				eventAnswerA: 'You feel confident that its better to make a little rather than lose a lot. You gained',
				eventAnswerB: 'The company heading up the research declared bankruptcy. Your money is gone. The net total comes to',
				eventAnswerC: 'Sparkle and shine, the cinema has never looked so clean. People choose your business over the competitor for ticket sales boost of',
				eventAnswerD: 'Unbelievable! You actually won a bunch of cash. Your money was quadrupled, for a total of'
			},
			{
				base: 4000,
				eventTitle: 'Sticky Fingers',
				modifierA: -2,
				modifierB: -0,
				modifierC: -4,
				modifierD: -1,
				eventMsg: 'You\'ve received a health code violation warning. Quick action is required, or the government will shut down your cinema.',
				eventOptA: 'Hire a cleaning crew and a renovation contractor to work the place over.',
				eventOptB: 'Fight those greedy hogs in court!',
				eventOptC: 'What business doesn\'t get a warning or two every now and then? Surely it will just pass over.',
				eventOptD: 'Clearly the inspector was looking for a bribe. Slip him a few, big bills.',
				eventAnswerA: 'It wasn\'t cheap, but the health inspector--try as he might--can\'t find anything to complain about. You spent',
				eventAnswerB: 'Amazing! You won! The inspector is under investigation for taking bribes. You lost',
				eventAnswerC: 'The inspector didn\'t agree with your relaxed response. He shut you down for a week, and dropped a fine in your lap. You lost',
				eventAnswerD: 'His smole reveals crooked teeth as a few slips of green paper find their way into the man\'s pocket. You spent'
			},
			{
				base: 5000,
				eventTitle: 'The Limelight',
				modifierA: 1,
				modifierB: 1,
				modifierC: 1,
				modifierD: 1,
				eventMsg: 'You\'ve won an award for being the best entertaining activities source tonight. The BEAST\'s coordinator asks you what makes your theaters so much fun.',
				eventOptA: 'Claim it\'s due to your genius as a business man.',
				eventOptB: 'Say it\'s the hardworking employees with their quick smiles and eager attitudes that make the place attractive.',
				eventOptC: 'Point out that everyone loves the movies. Who doesn\'t want to go on an adventure for two hours to far away places and meet interesting characters?',
				eventOptD: 'Give credit to the state of the art equipment your establishment uses.',
				eventAnswerA: 'The answer doesn\'t resonate with those who follow the BEAST, but the award comes with a cash price of',
				eventAnswerB: 'The answer makes your employees happy, and the award comes with a cash price of',
				eventAnswerC: 'The answer makes people want to keep coming to the movies, and the award comes with a cash price of',
				eventAnswerD: 'The answer later gets reprinted in a electronics magazine, keeping your notoriety alive. Oh, and the award comes with a cash price of'
			},
			{
				base: 5000,
				eventTitle: 'On The Fritz',
				modifierA: -1,
				modifierB: -1,
				modifierC: -1,
				modifierD: -1,
				eventMsg: 'It\'s not your day. The screen in one of your theaters fell, the sound system is bugging out, and a projector won\'t play anything slower than mach speed.',
				eventOptA: 'Have the screen fixed, and quickly patch the rest.',
				eventOptB: 'Repair the sound system, and slap some duct tape on the others.',
				eventOptC: 'Breathe life back into the projector, and improvise the other two.',
				eventOptD: 'Spread your resources around equally amongst the three.',
				eventAnswerA: 'It isn\'t perfect, but it will get you through the day. Repair cost',
				eventAnswerB: 'It isn\'t perfect, but it will get you through the day. Repair cost',
				eventAnswerC: 'It isn\'t perfect, but it will get you through the day. Repair cost',
				eventAnswerD: 'It isn\'t perfect, but it will get you through the day. Repair cost'
			},
			{
				base: 2000,
				eventTitle: 'The Color Scheme',
				modifierA: 1,
				modifierB: 3,
				modifierC: 2,
				modifierD: 4,
				eventMsg: 'It\'s time to give your cinema a new paint job. The color might very well lure more potential customers through the doors, or scare them off.',
				eventOptA: 'Paint it green.',
				eventOptB: 'Paint it blue.',
				eventOptC: 'Paint it white.',
				eventOptD: 'Paint it red.',
				eventAnswerA: 'Though green is the color of money, it doesn\'t make people want to watch more movies. A new paint job does make the place look better, though. You got a small boost to ticket sales, netting',
				eventAnswerB: 'Blue is regal and it really pops in the daytime. With sales increasing as a result you made an extra',
				eventAnswerC: 'White can\'t go wrong...until it gets dirty. But, that\'s a problem for another day. For now, your sales increased moderately for an additional',
				eventAnswerD: 'That red really sets your building apart from any of the others. People see it at once, and want to come in. You earned an whopping'
			}
		];
		game.currentEvent = {
			base: game.events[0].base,
			eventTitle: game.events[0].eventTitle,
			modifierA: game.events[0].modifierA,
			modifierB: game.events[0].modifierB,
			modifierC: game.events[0].modifierC,
			modifierD: game.events[0].modifierD,
			eventMsg: game.events[0].eventMsg,
			eventOptA: game.events[0].eventOptA,
			eventOptB: game.events[0].eventOptB,
			eventOptC: game.events[0].eventOptC,
			eventOptD: game.events[0].eventOptD,
			eventAnswerA: game.events[0].eventAnswerA,
			eventAnswerB: game.events[0].eventAnswerB,
			eventAnswerC: game.events[0].eventAnswerC,
			eventAnswerD: game.events[0].eventAnswerD,
			choice: 'A'
		};

		game.timeData = {};
		game.timeData.day = 1;								// Tracks the day of the year.
		game.timeData.seasonIndex = 0;						// Enum index for season. (relevant for movie effectiveness)
		game.timeData.season =
			season[game.timeData.seasonIndex];				// The current season in enum value.
		game.timeData.year = 1;								// Total years user has been playing.

		game.workshop = {};
		game.workshop.warningText = "";						// Unique warning text for the workshop module (async failures).

		getNewMovies(true);
	};
	// Adds an extra employee to the cinema.
	game.addEmployee = function()
	{
		if(game.employeeData.numOfEmployees >= game.employeeData.maxEmployees)
		{
			playSound('deniedSound');
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
			playSound('deniedSound');
			game.gameroomData.numOfGames = game.gameroomData.maxGames;
		}
		else
		{
			var cost = (game.gameroomData.numOfGames + 1) * game.gameroomData.newGamePriceMultiplier;
			if( cost <= (balance + 9990))
			{
				game.gameroomData.numOfGames++;
				balance -= cost;
				playSound('chaChingSound');
			}
			else
			{
				playSound('deniedSound');
			}
		}
	};
	// Adds extra parking iff player has the money.
	game.addParking = function()
	{
		if(game.parkingData.parkingLevels >= game.parkingData.maxParkingLevels)
		{
			playSound('deniedSound');
			game.parkingData.parkingLevels = game.parkingData.maxParkingLevels;
		}
		else
		{
			var cost = (game.parkingData.parkingLevels + 1) * game.parkingData.parkingExpandCost;
			if( cost <= (balance + 9990))
			{
				game.parkingData.parkingLevels++;
				balance -= cost;
				playSound('chaChingSound');
			}
			else
			{
				playSound('deniedSound');
			}
		}
	};
	// Adds a salon iff player has the money.
	game.addSalon = function()
	{
		if(game.salonData.numOfSalons >= game.salonData.maxSalons)
		{
			playSound('deniedSound');
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
				playSound('chaChingSound');
				return true;
			}
			else
			{
				playSound('deniedSound');
				return false;
			}
		}
	};
	// Adds a snack iff player has the money.
	game.addSnack = function()
	{
		if(game.snackData.numOfSnacks >= game.snackData.maxSnacks)
		{
			playSound('deniedSound');
			game.snackData.numOfSnacks = game.snackData.maxSnacks;
		}
		else
		{
			var cost = (game.snackData.numOfSnacks + 1) * game.snackData.newSnackPriceMultiplier;
			if( cost <= (balance + 9990))
			{
				game.snackData.numOfSnacks++;
				balance -= cost;
				playSound('chaChingSound');
			}
			else
			{
				playSound('deniedSound');
			}
		}
	};
	// Since salon object has seat quantity and balance checker, buy and adjust totalSeats.
	game.buySeats = function(salonNum, quantity)
	{
		var oldNumSeats = game.salonData.totalSeats;
		balance = game.salonData.salonsOwned[salonNum].addSeats(quantity, balance);
		game.salonData.totalSeats = calculateTotalSeats();
		if(game.salonData.totalSeats !== oldNumSeats)
		{
			playSound('chaChingSound');
		}
		else
		{
			playSound('deniedSound');
		}
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
	// Lets start screen keep checking if assets are loaded.
	game.checkIfLoaded = function() {
		return game.state.isLoading;
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
		playSound('eventRevealSound');
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
		if(game.miscData.ticketPrice <= 0)
		{
			playSound('deniedSound');
			game.miscData.ticketPrice = 0.0;
		}
	};
	// Main time-keeping function that serves as a simple game loop.
	game.newDay = function()
	{
		// Only happens if game isn't over
		if(game.state.isGameOver || game.state.isPaused)
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
			$rootScope.$broadcast('netWeekly');
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
		randomEventSpawn();
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
				playSound('chaChingSound');
				return true;
			}
			else
			{
				playSound('deniedSound');
				return false;
			}
		}
	};
	// Updates the increase of ticket price for entire game.
	game.raiseTicketPrice = function()
	{
		game.miscData.ticketPrice += 0.10;
		if(game.miscData.ticketPrice >= 100)
		{
			playSound('deniedSound');
			game.miscData.ticketPrice = 100.0;
		}
	};
	game.upgradeProjector = function(salonNum)
	{
		var oldBalance = balance;
		var maxLevel = game.salonData.salonsOwned[salonNum].getMaxUpgradeLevel();
		if(game.salonData.salonsOwned[salonNum].getProjectorLevel() >= maxLevel)
		{
			playSound('deniedSound');
			return;
		}
		balance = game.salonData.salonsOwned[salonNum].upgradeProjectorLevel(balance);
		if(balance !== oldBalance)
		{
			playSound('chaChingSound');
		}
		else
		{
			playSound('deniedSound');
		}
	};
	game.upgradeScreen = function(salonNum)
	{
		var oldBalance = balance;
		var maxLevel = game.salonData.salonsOwned[salonNum].getMaxUpgradeLevel();
		if(game.salonData.salonsOwned[salonNum].getScreenLevel() >= maxLevel)
		{
			playSound('deniedSound');
			return;
		}
		balance = game.salonData.salonsOwned[salonNum].upgradeScreenLevel(balance);
		if(balance !== oldBalance)
		{
			playSound('chaChingSound');
		}
		else
		{
			playSound('deniedSound');
		}
	};
	game.upgradeSound = function(salonNum)
	{
		var oldBalance = balance;
		var maxLevel = game.salonData.salonsOwned[salonNum].getMaxUpgradeLevel();
		if(game.salonData.salonsOwned[salonNum].getSoundLevel() >= maxLevel)
		{
			playSound('deniedSound');
			return;
		}
		balance = game.salonData.salonsOwned[salonNum].upgradeSoundLevel(balance);
		if(balance !== oldBalance)
		{
			playSound('chaChingSound');
		}
		else
		{
			playSound('deniedSound');
		}
	};
	// Adds a user created movie to the database iff balance available and content passes inspection.
	// Upon success, transfer movie into user's owned licenses.
	game.produceMovie = function(title, synopsis, optimalSeason, worstSeason, cost, licenseDuration, producer)
	{
		if((balance + 9990) < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier)
		{
			playSound('deniedSound');
			game.workshop.warningText = "Movie production failed. You need more money!";
		}
		else
		{
			// Randomly select popularity.
			var actualPopularity = Math.floor(Math.random() * 10 + 1) / 10.0;
			var expectedPopularity = Math.floor(Math.random() * 10 + 1) / 10.0;
			// Validate cost input.
			if(cost < 1000) cost = 1000;
			else if(cost > 7500) cost = 7500;
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
				playSound('deniedSound');
				game.workshop.warningText = "Movie production failed. Connection Problems?";
			});
		}
	};
	// Removes an employee from the cinema.
	game.removeEmployee = function()
	{
		if(game.employeeData.numOfEmployees <= 1)
		{
			playSound('deniedSound');
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