// Main function is to display theater data.
// Additional functions will include save, load, produce movies.
cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.state = game.state;
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

	self.state = game.state;
	self.intervalPromise;
	self.speed;

	self.activateTime = function(speed) {
		game.startGame();
		self.speed = speed;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};

	self.pauseTime = function() {
		game.state.isPaused = true;
		var cancelSucceeded = false;
		do
		{
			cancelSucceeded = $interval.cancel(self.intervalPromise);
		} while(!cancelSucceeded);
	};

	self.unpauseTime = function() {
		game.state.isPaused = false;
		self.intervalPromise = $interval(game.newDay, (1000 * self.speed));
	};
}]);