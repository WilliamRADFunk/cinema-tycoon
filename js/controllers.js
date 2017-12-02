// Main function is to purchase movie licenses and view movie details.
cinemaTycoonApp.controller('FilmVaultController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'vault') {
			self.exited();
		}
	});

	self.closeInspector = function()
	{
		self.state.isInspecting = false;
	};
	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'vault' });
	};
	self.exited = function()
	{
		self.active = false;
		self.state.selectedMovieLicense = '0';
		self.state.selectedMovieOwned = '0';
	};
	self.getSeason = function(index)
	{
		return game.getSeason(index);
	};
	self.openInspector = function(mode)
	{
		if(mode === 0 && self.state.selectedMovieLicense !== '0')
		{
			self.state.selectedMovie = game.miscData.moviesAvailable[Number(self.state.selectedMovieLicense)];
			self.state.isInspecting = true;
		}
		else if(mode === 1 && self.state.selectedMovieOwned !== '0')
		{
			self.state.selectedMovie = game.miscData.moviesOwned[Number(self.state.selectedMovieOwned)];
			self.state.isInspecting = true;
		}
	};
	self.purchaseMovie = function()
	{
		var success = false;
		if(self.state.selectedMovieLicense !== '0') success = game.purchaseLicense(Number(self.state.selectedMovieLicense));
		if(success)
		{
			self.state.selectedMovieLicense = '0';
			self.state.selectedMovie = null;
		}
	};
	self.setup = function()
	{
		self.active = false;
		self.miscData = game.miscData;
		self.state = game.state;
		self.state.isInspecting = false;
		self.state.selectedMovieLicense = '0';
		self.state.selectedMovieOwned = '0';
		self.state.selectedMovie = game.miscData.moviesAvailable[0];
	};

	self.setup();
}]);
// Main function is to adjust ticket price.
// Shows how much people like/dislike the price.
cinemaTycoonApp.controller('FrontDoorController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'ticket') {
			self.exited();
		}
	});

	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'ticket' });
	};
	self.exited = function()
	{
		self.active = false;
	};
	self.lowerTicketPrice = function()
	{
		game.lowerTicketPrice();
	};
	self.raiseTicketPrice = function()
	{
		game.raiseTicketPrice();
	};
	self.setup = function()
	{
		self.active = false;
		self.miscData = game.miscData;
		self.state = game.state;
	};

	self.setup();
}]);
// Main function is to increase games offered.
cinemaTycoonApp.controller('GameroomController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'games') {
			self.exited();
		}
	});

	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'games' });
	};
	self.exited = function()
	{
		self.active = false;
	};
	self.increaseGames = function()
	{
		game.addGame();
	};
	self.setup = function()
	{
		self.active = false;
		self.gameroomData = game.gameroomData;
		self.state = game.state;
	};

	self.setup();
}]);
// Main function is to display cinema data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', '$scope', function(game, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});

	self.getBalance = function()
	{
		return game.getBalance();
	};
	self.setup = function()
	{
		self.employeeData = game.employeeData;
		self.gameroomData = game.gameroomData;
		self.miscData = game.miscData;
		self.parkingData = game.parkingData;
		self.profitData = game.profitData;
		self.salonData = game.salonData;
		self.snackData = game.snackData;
		self.state = game.state;
		self.timeData = game.timeData;
	};

	self.setup();
}]);
// Main function is to handle employees, choose promotions, or make a movie.
cinemaTycoonApp.controller('OfficeController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'office') {
			self.exited();
		}
	});

	self.changePromo = function()
	{
		game.changePromo(Number(self.state.selectedPromo));
	};

	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'office' });
	};
	self.exited = function()
	{
		self.active = false;
	};
	self.fireEmployee = function()
	{
		game.removeEmployee();
	};
	self.hireEmployee = function()
	{
		game.addEmployee();
	};
	self.setup = function()
	{
		self.active = false;
		self.employeeData = game.employeeData;
		self.miscData = game.miscData;
		self.promos = game.getPromos();
		self.state = game.state;
		self.state.selectedPromo = '0';
	};

	self.setup();
}]);
// Main function is to increase parking capacity.
cinemaTycoonApp.controller('ParkingLotController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;
	/*
	 * Title: Horn Honk
	 * Author: Mike Koenig
	 * Download Source: http://soundbible.com/1048-Horn-Honk.html
	 * License: Attribution 3.0
	 */
	 self.parkingLotSound = new Audio('../sounds/horn-honk.mp3');

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'parking') {
			self.exited(false);
		}
	});

	self.entered = function()
	{
		self.active = true;
		self.parkingLotSound.play();
		$rootScope.$broadcast('sectionEntered', { section: 'parking' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		if(localTrigger) {
			self.parkingLotSound.play();
		}
	};
	self.expandParking = function()
	{
		game.addParking();
	};
	self.setup = function()
	{
		self.active = false;
		self.parkingData = game.parkingData;
		self.state = game.state;
	};

	self.setup();
}]);
// Main function is to handle salon details (buy seats, upgrade screen, change movie).
cinemaTycoonApp.controller('SalonController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'salon') {
			self.exited();
		}
	});

	self.buildSalon = function()
	{
		if(game.addSalon())
		{
			self.state.activeSalon = self.salonData.numOfSalons;
			self.state.selectedSalon = self.state.activeSalon.toString();
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};
	self.buyProjectorUpgrade = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeProjector(self.state.activeSalon - 1);
	};
	self.buyScreenUpgrade = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeScreen(self.state.activeSalon - 1);
	};
	self.buySeats = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.buySeats(self.state.activeSalon-1, self.seatAmount);
			self.seatAmount = 0;
		}
	};
	self.buySoundUpdate = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeSound(self.state.activeSalon - 1);
	};
	self.changeMoviePlaying = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.changeMoviePlaying((self.state.activeSalon-1), Number(self.state.selectedMovie));
		}
	};
	self.changeSalon = function()
	{
		if(Number(self.state.selectedSalon) > 0 && Number(self.state.selectedSalon) <= self.salonData.numOfSalons)
		{
			self.state.activeSalon = Number(self.state.selectedSalon);
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};
	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'salon' });
	};
	self.exited = function()
	{
		self.active = false;
	};
	self.getMaxSeats = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats();
	};
	self.getPossibleSeats = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else
		{
			return (self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats() -
					self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats());
		}
	};
	self.getProjectorUpgradeLevel = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getProjectorLevel();
	};
	self.getScreenUpgradeLevel = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getScreenLevel();
	};
	self.getSeats = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats();
	};
	self.getSeatCost = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0 || self.seatAmount === undefined) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeatCost(self.seatAmount);
	};
	self.getSoundUpgradeLevel = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSoundLevel();
	};
	self.setup = function()
	{
		self.active = false;
		self.miscData = game.miscData;
		self.salonData = game.salonData;
		self.isSalonAvailable = (self.salonData.numOfSalons < self.salonData.maxSalons) ? true : false;
		self.state = game.state;
		self.state.activeSalon = 0;
		self.state.selectedMovie = '0';
		self.state.selectedSalon = self.state.activeSalon.toString();
	};

	self.setup();
}]);
// Main function is to increase snacks offered.
cinemaTycoonApp.controller('SnackController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;
	/*
	 * Title: Pouring Hot Tea
	 * Author: Cori Samuel
	 * Download Source: http://soundbible.com/1244-Pouring-Hot-Tea.html
	 * License: Public Domain
	 */
	 self.snackDrinkSound = new Audio('../sounds/concession-drink.mp3');
	 /*
	 * Title: Popcorn Popping
	 * Author: KevanGC
	 * Download Source: http://soundbible.com/1710-Popcorn-Popping.html
	 * License: Public Domain
	 */
	 self.snackPopcornSound = new Audio('../sounds/concession-popcorn.mp3');

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'snack') {
			self.exited(false);
		}
	});

	self.entered = function()
	{
		self.active = true;
		self.snackDrinkSound.play();
		self.snackPopcornSound.play();
		setTimeout(function() {
			self.snackDrinkSound.pause();
			self.snackDrinkSound.currentTime = 0;
			self.snackPopcornSound.pause();
			self.snackPopcornSound.currentTime = 0;
		}, 2000);
		$rootScope.$broadcast('sectionEntered', { section: 'snack' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		if(localTrigger) {
			self.snackDrinkSound.play();
			self.snackPopcornSound.play();
			setTimeout(function() {
				self.snackDrinkSound.pause();
				self.snackDrinkSound.currentTime = 0;
				self.snackPopcornSound.pause();
				self.snackPopcornSound.currentTime = 0;
			}, 2000);
		}
	};
	self.increaseSnacks = function()
	{
		game.addSnack();
	};
	self.setup = function()
	{
		self.active = false;
		self.snackData = game.snackData;
		self.state = game.state;
	};

	self.setup();
}]);
// Main function is to instigate the game timer.
cinemaTycoonApp.controller('StartController', ['gameData', '$interval', '$rootScope', '$scope', function(game, $interval, $rootScope, $scope)
{
	var self = this;

	self.intervalPromise;
	self.speed;
	self.state = game.state;
	self.currentEvent = game.currentEvent;

	$scope.$on('event', function(msg, args)
	{
		self.pauseTime();
	});

	self.activateTime = function(speed)
	{
		game.startGame();
		self.speed = speed;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};
	self.exitHelp = function()
	{
		game.help(false);
		self.unpauseTime();
	};
	self.exitModal = function()
	{
		game.event(false);
		self.currentEvent.selectedResult = null;
		self.unpauseTime();
	};
	self.needHelp = function()
	{
		game.help(true);
		self.pauseTime();
	};
	self.pauseTime = function()
	{
		if(self.state.isPaused) return;
		game.pause(true);
		var cancelSucceeded = false;
		do
		{
			cancelSucceeded = $interval.cancel(self.intervalPromise);
		} while(!cancelSucceeded);
		self.intervalPromise = undefined;
	};
	self.restartGame = function(speed)
	{
		self.pauseTime();
		game = game.restartGame();
		self.state = game.state;
		$rootScope.$broadcast('restart');
	};
	self.submitEventChoice = function()
	{
		self.currentEvent.selectedOption = self.currentEvent['eventOpt' + self.currentEvent.choice];
		self.currentEvent.selectedResult = game.getEventResult(self.currentEvent.choice);
	};
	self.unpauseTime = function()
	{
		if(!self.state.isPaused) return;
		game.pause(false);
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};

	self.currentEvent.choice = self.currentEvent.eventChoiceA;
}]);
// Main function is to purchase movie licenses and produce new films.
cinemaTycoonApp.controller('WorkshopController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'workshop') {
			self.exited();
		}
	});

	self.closeProduction = function()
	{
		self.state.isProducing = false;
	};
	self.entered = function()
	{
		self.active = true;
		$rootScope.$broadcast('sectionEntered', { section: 'workshop' });
	};
	self.exited = function()
	{
		self.active = false;
		self.warningText = "";
	};
	self.produceMovie = function()
	{
		if(game.getBalance() < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) game.updateWarningText("workshop", "Not enough money!\n\nYou need $" + ((game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) + " and you only have $" + game.getBalance());
		else
		{
			self.state.isProducing = true;
		}
	};
	self.setup = function()
	{
		self.active = false;
		self.cost = 1000;
		self.licenseDuration = 0;
		self.miscData = game.miscData;
		self.optimalSeason = 0;
		self.producer = "Anonymous";
		self.state = game.state;
		self.state.isProducing = false;
		self.synopsis = "No synopsis given.";
		self.title = "Untitled";
		self.warningText = game.workshop.warningText;
		self.worstSeason = 0;
	};
	self.submitProduction = function()
	{
		game.produceMovie(self.title, self.synopsis, self.optimalSeason, self.worstSeason, self.cost, self.licenseDuration, self.producer);
		self.state.isProducing = false;
	};

	self.setup();
}]);