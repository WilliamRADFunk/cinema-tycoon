var cinemaTycoonApp = angular.module('cinemaTycoonApp',[]);

cinemaTycoonApp.factory('gameData', function(){
	var game = {};

	game.balance = 1000;
	game.ticketPrice = 10.00;

	game.lowerTicketPrice = function() {
		game.ticketPrice -= 0.10;
		if(game.ticketPrice <= 0) game.ticketPrice = 0.0;
		console.log(game.ticketPrice);
	};

	return game;
});

cinemaTycoonApp.controller('HUDController', ['gameData', function(game) {
	var self = this;

	self.content = game;
}]);

cinemaTycoonApp.controller('FrontDoorController', ['gameData', function(game) {
	var self = this;

	self.content = game;

	self.lowerTicketPrice = function() {
		game.lowerTicketPrice();
	}
}]);