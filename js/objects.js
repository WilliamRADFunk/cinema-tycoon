var createTheater = function() {
	var seats = 10;
	var seatCost = 200;
	var maxSeats = 100;

	var projectorLevel = 1;
	var screenLevel = 1;
	var soundLevel = 1;
	var maxUpgradeLevel = 10;
	var upgradeMultiplier = 300;

	var moviePlaying = {optimalSeason: 1, // TODO: change to {} after testing.
						worstSeason: 1,
						actualPopularity: 0.5};
	var isMoviePlaying = true; // TODO: change to false after testing.

	return {
		getTicketsSold: function(modifier, season) {
			if(!isMoviePlaying) return 0;
			else
			{
				modifier += (projectorLevel * 0.01) + (screenLevel * 0.01) + (soundLevel * 0.01);
				if(season === moviePlaying.optimalSeason) modifier += 0.1;
				if(season === moviePlaying.worstSeason) modifier -= 0.1;
				modifier += (moviePlaying.actualPopularity * 0.1);
				modifier *= seats;
				var seatsFilled = Math.ceil(modifier);
				if(seatsFilled >= seats) return seats;
				else return seatsFilled;
			}
		},
		getSeats: function() {
			return seats;
		},
		getSeatCost: function() {
			return seatCost;
		},
		getMaxSeats: function() {
			return maxSeats;
		},
		addSeats: function(quantity, balance) {
			if(balance < (seatCost * quantity)) return balance;
			else if (quantity <= (maxSeats - seats))
			{
				seats += quantity;
				balance -= seatCost * quantity;
				return balance;
			}
			else
			{
				var actualQuantity = maxSeats - seats;
				seats = maxSeats;
				balance -= seatCost * actualQuantity;
				return balance;
			}
		},
		getProjectorLevel: function() {
			return projectorLevel;
		},
		upgradeProjectorLevel: function(balance) {
			if(projectorLevel >= maxUpgradeLevel) projectorLevel = maxUpgradeLevel;
			else if( (projectorLevel + 1) * upgradeMultiplier <= balance ) projectorLevel++;
		},
		getScreenLevel: function() {
			return screenLevel;
		},
		upgradeScreenLevel: function(balance) {
			if(screenLevel >= maxUpgradeLevel) screenLevel = maxUpgradeLevel;
			else if( (screenLevel + 1) * upgradeMultiplier <= balance ) screenLevel++;
		},
		getSoundLevel: function() {
			return soundLevel;
		},
		upgradeSoundLevel: function(balance) {
			if(soundLevel >= maxUpgradeLevel) soundLevel = maxUpgradeLevel;
			else if( (soundLevel + 1) * upgradeMultiplier <= balance ) soundLevel++;
		},
		getUpgradeMultiplier: function() {
			return upgradeMultiplier;
		},
		getMaxUpgradeLevel: function() {
			return maxUpgradeLevel;
		},
		getMoviePlaying: function() {
			return moviePlaying;
		},
		setMoviePlaying: function(movie) {
			if(movie === undefined || movie === null) return;
			// This is how we set no movie to play.
			if(movie === 0)
			{
				moviePlaying = {};
				isMoviePlaying = false;
				return;
			}
			// Ensures only legit movies make it into the theater itself.
			if(movie.title === undefined || movie.title === null || movie.title === "") return;
			if(movie.synopsis === undefined || movie.synopsis === null || movie.synopsis === "") return;
			if(movie.expectedPopularity === undefined || movie.expectedPopularity === null || movie.expectedPopularity < 0 || movie.expectedPopularity > 1) return;
			if(movie.actualPopularity === undefined || movie.actualPopularity === null || movie.actualPopularity < 0 || movie.actualPopularity > 1) return;
			if(movie.optimalSeason === undefined || movie.optimalSeason === null || movie.optimalSeason < 0 || movie.optimalSeason > 3) return;
			if(movie.worstSeason === undefined || movie.worstSeason === null || movie.worstSeason < 0 || movie.worstSeason > 3) return;
			if(movie.costLicense === undefined || movie.costLicense === null || movie.costLicense < 0) return;
			if(movie.licenseLength === undefined || movie.licenseLength === null || movie.licenseLength <= 0) return;
			// Assumes everything checked out perfectly.
			moviePlaying = movie;
			isMoviePlaying = true;
		},
		isMoviePlaying: function() {
			return isMoviePlaying;
		}
	}
};