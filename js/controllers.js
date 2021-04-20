// Main function is to purchase movie licenses and view movie details.
cinemaTycoonApp.controller('FilmVaultController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;
	self.vaultDoorSound = game.sounds.vaultDoorSound;
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.deniedSound = game.sounds.deniedSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'vault')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playDenied = function()
	{
		self.deniedSound.pause();
		self.deniedSound.currentTime = 0;
		self.deniedSound.play();
	};

	self.closeInspector = function()
	{
		playBlop();
		self.state.isInspecting = false;
	};
	self.entered = function()
	{
		self.active = true;
		self.vaultDoorSound.pause();
		self.vaultDoorSound.currentTime = 0;
		self.vaultDoorSound.play();
		$rootScope.$broadcast('sectionEntered', { section: 'vault' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		self.vaultDoorSound.pause();
		self.vaultDoorSound.currentTime = 0;
		if(localTrigger)
		{
			playBlop();
		}
		self.state.selectedMovieLicense = '0';
		self.state.selectedMovieOwned = '0';
	};
	self.getSeason = function(index)
	{
		return game.getSeason(index);
	};
	self.openInspector = function(mode)
	{
		playBlop();
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
		else
		{
			playDenied();
		}
	};
	self.purchaseMovie = function()
	{
		var success = false;
		if(self.state.selectedMovieLicense !== '0')
		{
			success = game.purchaseLicense(Number(self.state.selectedMovieLicense));
		}
		else
		{
			playDenied();
		}
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
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.cashRegisterSound = game.sounds.cashRegisterSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'ticket')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playCashRegisterSound = function()
	{
		self.cashRegisterSound.pause();
		self.cashRegisterSound.currentTime = 0;
		self.cashRegisterSound.play();
	};

	self.entered = function()
	{
		self.active = true;
		playCashRegisterSound();
		$rootScope.$broadcast('sectionEntered', { section: 'ticket' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		self.cashRegisterSound.pause();
		self.cashRegisterSound.currentTime = 0;
		if(localTrigger)
		{
			playBlop();
		}
	};
	self.lowerTicketPrice = function()
	{
		playBlop();
		game.lowerTicketPrice();
	};
	self.raiseTicketPrice = function()
	{
		playBlop();
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
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.arcadeSound = game.sounds.arcadeSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'games')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playArcadeSound = function()
	{
		self.arcadeSound.pause();
		self.arcadeSound.currentTime = 0;
		self.arcadeSound.play();
	};

	self.entered = function()
	{
		self.active = true;
		playArcadeSound();
		$rootScope.$broadcast('sectionEntered', { section: 'games' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		self.arcadeSound.pause();
		self.arcadeSound.currentTime = 0;
		if(localTrigger)
		{
			playBlop();
		}
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

	$scope.$on('netWeekly', function()
	{
		if(self.profitData.netProfit > 0)
		{
			self.colorClass = 'green';
		}
		else if(self.profitData.netProfit < 0)
		{
			self.colorClass = 'red';
		}
		else
		{
			self.colorClass = '';
		}
	});

	self.getBalance = function()
	{
		return game.getBalance();
	};

	self.toggleExpenses = function()
	{
		self.toggleState = !self.toggleState
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
		self.toggleState = false;
	};

	self.setup();
}]);
// Main function is to handle employees, choose promotions, or make a movie.
cinemaTycoonApp.controller('OfficeController', ['gameData', '$rootScope', '$scope', function(game, $rootScope, $scope)
{
	var self = this;
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.doorSound = game.sounds.doorSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'office')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playDoorSound = function()
	{
		self.doorSound.pause();
		self.doorSound.currentTime = 0;
		self.doorSound.play();
	};

	self.changePromo = function()
	{
		game.changePromo(Number(self.state.selectedPromo));
	};

	self.entered = function()
	{
		self.active = true;
		playDoorSound();
		$rootScope.$broadcast('sectionEntered', { section: 'office' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		if(localTrigger)
		{
			self.doorSound.pause();
			self.doorSound.currentTime = 0;
			playBlop();
		}
	};
	self.fireEmployee = function()
	{
		playBlop();
		game.removeEmployee();
	};
	self.hireEmployee = function()
	{
		playBlop();
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
	self.parkingLotSound = game.sounds.parkingLotSound;
	self.buttonBlopSound = game.sounds.buttonBlopSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'parking')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};

	self.entered = function()
	{
		self.active = true;
		self.parkingLotSound.pause();
		self.parkingLotSound.currentTime = 0;
		self.parkingLotSound.play();
		$rootScope.$broadcast('sectionEntered', { section: 'parking' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		self.parkingLotSound.pause();
		self.parkingLotSound.currentTime = 0;
		if(localTrigger)
		{
			playBlop();
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
cinemaTycoonApp.controller('SalonController', ['gameData', '$rootScope', '$scope', '$timeout', function(game, $rootScope, $scope, $timeout)
{
	var self = this;
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.chatterSound = game.sounds.chatterSound;

	self.timeoutPromise;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'salon')
		{
			self.exited(false);
		}
	});

	var salonReference = createSalon();
	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playSalonSounds = function()
	{
		killSounds();
		self.chatterSound.play();
		self.timeoutPromise = $timeout(function()
		{
			self.chatterSound.pause();
			self.chatterSound.currentTime = 0;
			$timeout.cancel(self.timeoutPromise);
			self.timeoutPromise = undefined;
		}, 2000);
	};
	var killSounds = function()
	{
		if(self.timeoutPromise)
		{
			$timeout.cancel(self.timeoutPromise);
		}
		self.chatterSound.pause();
		self.chatterSound.currentTime = 0;
	};

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
	self.changeSeatAmount = function(seats)
	{
		if(seats > self.getPossibleSeats())
		{
			self.seatAmount = self.getPossibleSeats();
		}
	}
	self.entered = function()
	{
		self.active = true;
		playSalonSounds();
		$rootScope.$broadcast('sectionEntered', { section: 'salon' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		killSounds();
		if(localTrigger)
		{
			playBlop();
		}
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
		else if(self.salonData.salonsOwned[self.state.activeSalon - 1].getProjectorLevel() >= salonReference.getMaxUpgradeLevel()) return 'MAX';
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getProjectorLevel();
	};
	self.getScreenUpgradeLevel = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else if(self.salonData.salonsOwned[self.state.activeSalon - 1].getScreenLevel() >= salonReference.getMaxUpgradeLevel()) return 'MAX';
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
		else return salonReference.getSeatCost(self.seatAmount);
	};
	self.getSoundUpgradeLevel = function()
	{
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else if(self.salonData.salonsOwned[self.state.activeSalon - 1].getSoundLevel() >= salonReference.getMaxUpgradeLevel()) return 'MAX';
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
cinemaTycoonApp.controller('SnackController', ['gameData', '$rootScope', '$scope', '$timeout', function(game, $rootScope, $scope, $timeout)
{
	var self = this;
	self.timeoutPromise;
	self.snackDrinkSound = game.sounds.snackDrinkSound;
	self.snackPopcornSound = game.sounds.snackPopcornSound;
	self.buttonBlopSound = game.sounds.buttonBlopSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'snack')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};

	self.entered = function()
	{
		self.active = true;
		var cancelSucceeded = false;
		if(self.timeoutPromise)
		{
			self.snackDrinkSound.pause();
			self.snackDrinkSound.currentTime = 0;
			self.snackPopcornSound.pause();
			self.snackPopcornSound.currentTime = 0;
			$timeout.cancel(self.timeoutPromise);
			self.timeoutPromise = undefined;
		}
		self.snackDrinkSound.play();
		self.snackPopcornSound.play();
		self.timeoutPromise = $timeout(function()
		{
			self.snackDrinkSound.pause();
			self.snackDrinkSound.currentTime = 0;
			self.snackPopcornSound.pause();
			self.snackPopcornSound.currentTime = 0;
			$timeout.cancel(self.timeoutPromise);
			self.timeoutPromise = undefined;
		}, 2000);
		$rootScope.$broadcast('sectionEntered', { section: 'snack' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		var cancelSucceeded = false;
		if(self.timeoutPromise)
		{
			self.snackDrinkSound.pause();
			self.snackDrinkSound.currentTime = 0;
			self.snackPopcornSound.pause();
			self.snackPopcornSound.currentTime = 0;
			$timeout.cancel(self.timeoutPromise);
			self.timeoutPromise = undefined;
		}
		if(localTrigger)
		{
			playBlop();
			self.timeoutPromise = $timeout(function()
			{
				self.snackDrinkSound.pause();
				self.snackDrinkSound.currentTime = 0;
				self.snackPopcornSound.pause();
				self.snackPopcornSound.currentTime = 0;
				$timeout.cancel(self.timeoutPromise);
				self.timeoutPromise = undefined;
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
	self.checkIfLoaded = game.checkIfLoaded;
	self.currentEvent = game.currentEvent;
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.themeSound = game.sounds.themeSound;

	self.state.helpChoice = 'isHelpWin';

	$scope.$on('event', function(msg, args)
	{
		self.pauseTime();
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	self.activateTime = function(speed)
	{
		playBlop();
		game.startGame();
		self.themeSound.play();
		self.speed = speed;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};
	self.exitHelp = function()
	{
		playBlop();
		game.help(false);
	};
	self.exitModal = function()
	{
		playBlop();
		game.event(false);
		self.currentEvent.selectedResult = null;
	};
	self.needHelp = function()
	{
		playBlop();
		game.help(true);
		self.pauseTime();
	};
	self.pauseTime = function(localTrigger)
	{
		if(localTrigger) playBlop();
		if(self.intervalPromise)
		{
			var cancelSucceeded = false;
			do
			{
				cancelSucceeded = $interval.cancel(self.intervalPromise);
			} while(!cancelSucceeded);
			self.intervalPromise = undefined;
		}
		game.pause(true);
	};
	self.restartGame = function(speed)
	{
		self.pauseTime();
		game = game.restartGame();
		self.state = game.state;
		self.currentEvent = game.currentEvent;		
		self.currentEvent.choice = self.currentEvent.eventChoiceA;
		$rootScope.$broadcast('restart');
	};
	self.submitEventChoice = function()
	{
		playBlop();
		self.currentEvent.selectedOption = self.currentEvent['eventOpt' + self.currentEvent.choice];
		self.currentEvent.selectedResult = game.getEventResult(self.currentEvent.choice);
	};
	self.unpauseTime = function(localTrigger)
	{
		if(localTrigger) playBlop();
		if(self.intervalPromise)
		{
			var cancelSucceeded = false;
			do
			{
				cancelSucceeded = $interval.cancel(self.intervalPromise);
			} while(!cancelSucceeded);
			self.intervalPromise = undefined;
		}
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
	self.state = game.state;
	self.state.warningText = game.workshop.warningText;
	self.buttonBlopSound = game.sounds.buttonBlopSound;
	self.doorSound = game.sounds.doorSound;
	self.deniedSound = game.sounds.deniedSound;

	$scope.$on('restart', function()
	{
		self.setup();
	});
	$scope.$on('sectionEntered', function(msg, args)
	{
		if(args.section !== 'workshop')
		{
			self.exited(false);
		}
	});

	var playBlop = function()
	{
		self.buttonBlopSound.pause();
		self.buttonBlopSound.currentTime = 0;
		self.buttonBlopSound.play();
	};
	var playDoorSound = function()
	{
		self.doorSound.pause();
		self.doorSound.currentTime = 0;
		self.doorSound.play();
	};
	var playDenied = function()
	{
		self.deniedSound.pause();
		self.deniedSound.currentTime = 0;
		self.deniedSound.play();
	};

	self.closeProduction = function()
	{
		self.state.isProducing = false;
	};
	self.entered = function()
	{
		self.active = true;
		playDoorSound();
		$rootScope.$broadcast('sectionEntered', { section: 'workshop' });
	};
	self.exited = function(localTrigger)
	{
		self.active = false;
		game.updateWarningText("workshop", "");
		self.state.warningText = game.workshop.warningText;
		if(localTrigger)
		{
			self.doorSound.pause();
			self.doorSound.currentTime = 0;
			playBlop();
		}
	};
	self.produceMovie = function()
	{
		if(game.getBalance() < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier)
		{
			playDenied();
			game.updateWarningText("workshop", "Not enough money!\n\nYou need $" + ((game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) + " and you only have $" + game.getBalance());
			self.state.warningText = game.workshop.warningText;
		}
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