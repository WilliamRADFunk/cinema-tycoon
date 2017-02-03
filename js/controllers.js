// Main function is to adjust ticket price.
// Shows how much people like/dislike the price.
cinemaTycoonApp.controller('FrontDoorController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.miscData = game.miscData;
	self.state = game.state;

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.lowerTicketPrice = function() {
		game.lowerTicketPrice();
	};

	self.raiseTicketPrice = function() {
		game.raiseTicketPrice();
	};
}]);
// Main function is to increase games offered.
cinemaTycoonApp.controller('GameroomController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.gameroomData = game.gameroomData;
	self.state = game.state;

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.increaseGames = function() {
		game.addGame();
	};
}]);
// Main function is to display cinema data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.employeeData = game.employeeData;
	self.gameroomData = game.gameroomData;
	self.miscData = game.miscData;
	self.parkingData = game.parkingData;
	self.profitData = game.profitData;
	self.salonData = game.salonData;
	self.snackData = game.snackData;
	self.state = game.state;
	self.timeData = game.timeData;
}]);
// Main function is to handle employees, choose promotions, or make a movie.
cinemaTycoonApp.controller('OfficeController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.employeeData = game.employeeData;
	self.miscData = game.miscData;
	self.promos = game.getPromos();
	self.state = game.state;
	self.state.selectedPromo = '0';

	self.changePromo = function() {
		game.changePromo(Number(self.state.selectedPromo));
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.fireEmployee = function() {
		game.removeEmployee();
	};

	self.hireEmployee = function() {
		game.addEmployee();
	};
}]);
// Main function is to increase parking capacity.
cinemaTycoonApp.controller('ParkingLotController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.parkingData = game.parkingData;
	self.state = game.state;

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.expandParking = function() {
		game.addParking();
	};
}]);
// Main function is to handle salon details (buy seats, upgrade screen, change movie).
cinemaTycoonApp.controller('SalonController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.miscData = game.miscData;
	self.salonData = game.salonData;
	self.isSalonAvailable = (self.salonData.numOfSalons < self.salonData.maxSalons) ? true : false;
	self.state = game.state;
	self.state.activeSalon = 0;
	self.state.selectedMovie = '0';
	self.state.selectedSalon = self.state.activeSalon.toString();

	self.buildSalon = function() {
		if(game.addSalon())
		{
			self.state.activeSalon = self.salonData.numOfSalons;
			self.state.selectedSalon = self.state.activeSalon.toString();
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};

	self.buyProjectorUpgrade = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeProjector(self.state.activeSalon - 1);
	};

	self.buyScreenUpgrade = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeScreen(self.state.activeSalon - 1);
	};

	self.buySeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.buySeats(self.state.activeSalon-1, self.seatAmount);
			self.seatAmount = 0;
		}
	};

	self.buySoundUpdate = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return game.upgradeSound(self.state.activeSalon - 1);
	};

	self.changeMoviePlaying = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return;
		else
		{
			game.changeMoviePlaying((self.state.activeSalon-1), Number(self.state.selectedMovie));
		}
	};

	self.changeSalon = function() {
		if(Number(self.state.selectedSalon) > 0 && Number(self.state.selectedSalon) <= self.salonData.numOfSalons)
		{
			self.state.activeSalon = Number(self.state.selectedSalon);
			self.state.selectedMovie = game.getMoviePlayingIndex(self.state.activeSalon - 1).toString();
		}
	};

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.getMaxSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats();
	};

	self.getPossibleSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else
		{
			return (self.salonData.salonsOwned[self.state.activeSalon - 1].getMaxSeats() -
					self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats());
		}
	};

	self.getProjectorUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getProjectorLevel();
	};

	self.getScreenUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getScreenLevel();
	};

	self.getSeats = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeats();
	};

	self.getSeatCost = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0 || self.seatAmount === undefined) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSeatCost(self.seatAmount);
	};

	self.getSoundUpgradeLevel = function() {
		if(self.state.activeSalon <= 0 || self.salonData.numOfSalons <= 0) return 0;
		else return self.salonData.salonsOwned[self.state.activeSalon - 1].getSoundLevel();
	};
}]);
// Main function is to increase snacks offered.
cinemaTycoonApp.controller('SnackController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.snackData = game.snackData;
	self.state = game.state;

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.increaseSnacks = function() {
		game.addSnack();
	};
}]);
// Main function is to instigate the game timer.
cinemaTycoonApp.controller('StartController', ['gameData', '$interval', function(game, $interval) {
	var self = this;

	self.intervalPromise;
	self.speed;
	self.state = game.state;

	self.activateTime = function(speed) {
		game.startGame();
		self.speed = speed;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};

	self.exitHelp = function() {
		game.help(false);
		self.unpauseTime();
	};

	self.needHelp = function() {
		game.help(true);
		self.pauseTime();
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
}]);
// Main function is to purchase movie licenses and produce new films.
cinemaTycoonApp.controller('WorkshopController', ['gameData', function(game) {
	var self = this;

	self.active = false;
	self.miscData = game.miscData;
	self.state = game.state;

	self.entered = function() {
		self.active = true;
	};

	self.exited = function() {
		self.active = false;
	};

	self.produceMovie = function() {
		if(game.miscData.balance < (game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) window.alert("Not enough money!\n\nYou need $" + ((game.miscData.moviesMade + 1) * game.miscData.movieProductionModifier) + " and you only have $" + game.miscData.balance);
		else window.alert("Let's make a movie!")//game.produceMovie();
	};
}]);