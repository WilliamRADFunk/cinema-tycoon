var createSalon = function() {
	var seats = 10;
	var seatCost = 200;
	var maxSeats = 100;

	var projectorLevel = 1;
	var screenLevel = 1;
	var soundLevel = 1;
	var maxUpgradeLevel = 10;
	var upgradeMultiplier = 300;

	var moviePlaying = null;
	var isMoviePlaying = false;

	return {
		getTicketsSold: function(modifier, season) {
			if(!isMoviePlaying) return 0;
			else
			{
				modifier += (projectorLevel * 0.01) + (screenLevel * 0.01) + (soundLevel * 0.01);
				if(season === moviePlaying.getOptimalSeason()) modifier += 0.03;
				if(season === moviePlaying.getWorstSeason()) modifier -= 0.03;
				modifier += (moviePlaying.getActualPopularity() * 0.1);
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
		getSeatCost: function(quantity) {
			return (seatCost * quantity);
		},
		getProjectorLevel: function() {
			return projectorLevel;
		},
		upgradeProjectorLevel: function(balance) {
			if(projectorLevel >= maxUpgradeLevel) projectorLevel = maxUpgradeLevel;
			else if( (projectorLevel + 1) * upgradeMultiplier <= balance )
			{
				balance -= (projectorLevel + 1) * upgradeMultiplier;
				projectorLevel++;
			}
			return balance;
		},
		getScreenLevel: function() {
			return screenLevel;
		},
		upgradeScreenLevel: function(balance) {
			if(screenLevel >= maxUpgradeLevel) screenLevel = maxUpgradeLevel;
			else if( (screenLevel + 1) * upgradeMultiplier <= balance )
			{
				balance -= (screenLevel + 1) * upgradeMultiplier;
				screenLevel++;
			}
			return balance;
		},
		getSoundLevel: function() {
			return soundLevel;
		},
		upgradeSoundLevel: function(balance) {
			if(soundLevel >= maxUpgradeLevel) soundLevel = maxUpgradeLevel;
			else if( (soundLevel + 1) * upgradeMultiplier <= balance )
			{
				balance -= (soundLevel + 1) * upgradeMultiplier;
				soundLevel++;
			}
			return balance;
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
				moviePlaying = null;
				isMoviePlaying = false;
				return;
			}
			var t = movie.getTitle();
			var s = movie.getSynopsis();
			var ep = movie.getExpectedPopularity();
			var ap = movie.getActualPopularity();
			var op = movie.getOptimalSeason();
			var wp = movie.getWorstSeason();
			var cl = movie.getCostLicense();
			var ll = movie.getLicenseLength();
			// Ensures only legit movies make it into the salon itself.
			if(t === undefined || t === null || t === "") return;
			if(s === undefined || s === null || s === "") return;
			if(ep === undefined || ep === null || ep < 0 || ep > 1) return;
			if(ap === undefined || ap === null || ap < 0 || ap > 1) return;
			if(op === undefined || op === null || op < 0 || op > 3) return;
			if(wp === undefined || wp === null || wp < 0 || wp > 3) return;
			if(cl === undefined || cl === null || cl < 0) return;
			if(ll === undefined || ll === null || ll <= 0) return;
			// Assumes everything checked out perfectly.
			moviePlaying = movie;
			isMoviePlaying = true;
		},
		isMoviePlaying: function() {
			return isMoviePlaying;
		}
	}
};

var createMovie = function(title, synopsis, expectedPopularity, actualPopularity, optimalSeason, worstSeason, costLicense, licenseLength, producedBy) {
	var title = title;
	var synopsis = synopsis;
	var expectedPopularity = expectedPopularity;
	var actualPopularity = actualPopularity;
	var optimalSeason = optimalSeason;
	var worstSeason = worstSeason;
	var costLicense = costLicense;
	var licenseLength = licenseLength;
	var producedBy = producedBy;

	if(title === undefined || title === null || title === "") title = "Untitled";
	if(synopsis === undefined || synopsis === null || synopsis === "") synopsis = "No Description";
	if(expectedPopularity === undefined || expectedPopularity === null || expectedPopularity < 0 || expectedPopularity > 1) expectedPopularity = 0.1;
	if(actualPopularity === undefined || actualPopularity === null || actualPopularity < 0 || actualPopularity > 1) actualPopularity = 0.1;
	if(optimalSeason === undefined || optimalSeason === null || optimalSeason < 0 || optimalSeason > 3) optimalSeason = 3;
	if(worstSeason === undefined || worstSeason === null || worstSeason < 0 || worstSeason > 3) worstSeason = 0;
	if(costLicense === undefined || costLicense === null || costLicense <= 0) costLicense = 10000;
	if(licenseLength === undefined || licenseLength === null || licenseLength <= 0) licenseLength = 12;
	if(producedBy === undefined || producedBy === null || producedBy === "") producedBy = "Anonymous";

	return {
		getTitle: function() {
			return title;
		},
		getSynopsis: function() {
			return synopsis;
		},
		getExpectedPopularity: function() {
			return expectedPopularity;
		},
		getActualPopularity: function() {
			return actualPopularity;
		},
		getOptimalSeason: function() {
			return optimalSeason;
		},
		getWorstSeason: function() {
			return worstSeason;
		},
		getCostLicense: function() {
			return costLicense;
		},
		getLicenseLength: function() {
			return licenseLength;
		},
		getProducedBy: function() {
			return producedBy;
		}
	};
};