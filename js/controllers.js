// Main function is to display cinema data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.state = game.state;
	self.timeData = game.timeData;
	self.miscData = game.miscData;
	self.salonData = game.salonData;
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

	self.state = game.state;
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

	self.state = game.state;
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

	self.state = game.state;
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
// Main function is to purchase movie licenses and produce new films.
cinemaTycoonApp.controller('WorkshopController', ['gameData', function(game) {
	var self = this;

	self.state = game.state;
	self.miscData = game.miscData;
	self.active = false;

	self.produceMovie = function() {
		if(game.miscData.balance < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) window.alert("Not enough money!\n\nYou need $" + ((game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) + " and you only have $" + game.miscData.balance);
		else
		{
		window.alert("Let's make a movie!")//game.produceMovie();
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

	self.state = game.state;
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

	self.state = game.state;
	self.miscData = game.miscData;
	self.employeeData = game.employeeData;
	self.promos = game.getPromos();
	self.state.selectedPromo = '0';
	self.active = false;

	self.changePromo = function() {
		game.changePromo(Number(self.state.selectedPromo));
	};

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
// Main function is to handle salon details (buy seats, upgrade screen, change movie).
cinemaTycoonApp.controller('SalonController', ['gameData', function(game) {
	var self = this;

	self.state = game.state;
	self.miscData = game.miscData;
	self.salonData = game.salonData;
	self.isSalonAvailable = (self.salonData.numOfSalons < self.salonData.maxSalons) ? true : false;
	self.state.activeSalon = 0;
	self.state.selectedSalon = self.state.activeSalon.toString();
	self.state.selectedMovie = '0';
	self.active = false;

	self.buildSalon = function() {
		if(game.addSalon())
		{
			self.state.activeSalon = self.salonData.numOfSalons;
			self.state.selectedSalon = self.state.activeSalon.toString();
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};

	self.changeSalon = function() {
		if(Number(self.state.selectedSalon) > 0 && Number(self.state.selectedSalon) <= self.salonData.numOfSalons)
		{
			self.state.activeSalon = Number(self.state.selectedSalon);
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};

	self.getPossibleSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else
		{
			return (self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats() -
					self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats());
		}
	};

	self.getSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats();
	};

	self.getMaxSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats();
	};

	self.getSeatCost = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0 || self.seatAmount === undefined) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeatCost(self.seatAmount);
	},

	self.buySeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.buySeats(self.state.activeSalon-1, self.seatAmount);
			self.seatAmount = 0;
		}
	};

	self.changeMoviePlaying = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.changeMoviePlaying((self.state.activeSalon-1), Number(self.state.selectedMovie));
		}
	};

	self.getProjectorUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getProjectorLevel();
	},

	self.getScreenUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getScreenLevel();
	},

	self.getSoundUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSoundLevel();
	},

	self.buyProjectorUpgrade = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeProjector(self.state.activeSalon - 1);
	},

	self.buyScreenUpgrade = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeScreen(self.state.activeSalon - 1);
	},

	self.buySoundUpdate = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeSound(self.state.activeSalon - 1);
	},

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

	self.state = game.state;
	self.intervalPromise;
	self.speed;

	self.activateTime = function(speed) {
		game.startGame();
		self.speed = speed;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};

	self.pauseTime = function() {
		if(self.state.isPaused) return;
		game.pause(true);
		var cancelSucceeded = false;
		do
		{
			cancelSucceeded = $interval.cancel(self.intervalPromise);
		} while(!cancelSucceeded);
	};

	self.unpauseTime = function() {
		if(!self.state.isPaused) return;
		game.pause(false);
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};

	self.needHelp = function() {
		game.help(true);
		self.pauseTime();
	};

	self.exitHelp = function() {
		game.help(false);
		self.unpauseTime();
	};
}]);