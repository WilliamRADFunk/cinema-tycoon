var createMovie = function(title, synopsis, expectedPopularity, actualPopularity, optimalSeason, worstSeason, costLicense, licenseLength, producedBy)
{
	var actualPopularity = actualPopularity;
	var costLicense = costLicense;
	var expectedPopularity = expectedPopularity;
	var licenseLength = licenseLength;
	var optimalSeason = optimalSeason;
	var producedBy = producedBy;
	var synopsis = synopsis;
	var title = title;
	var worstSeason = worstSeason;

	if(actualPopularity === undefined || actualPopularity === null || actualPopularity < 0 || actualPopularity > 1) actualPopularity = 0.1;
	if(costLicense === undefined || costLicense === null || costLicense <= 0) costLicense = 10000;
	if(expectedPopularity === undefined || expectedPopularity === null || expectedPopularity < 0 || expectedPopularity > 1) expectedPopularity = 0.1;
	if(licenseLength === undefined || licenseLength === null || licenseLength <= 0) licenseLength = 12;
	if(optimalSeason === undefined || optimalSeason === null || optimalSeason < 0 || optimalSeason > 3) optimalSeason = 3;
	if(producedBy === undefined || producedBy === null || producedBy === "") producedBy = "Anonymous";
	if(synopsis === undefined || synopsis === null || synopsis === "") synopsis = "No Description";
	if(title === undefined || title === null || title === "") title = "Untitled";
	if(worstSeason === undefined || worstSeason === null || worstSeason < 0 || worstSeason > 3) worstSeason = 0;

	return {
		decrementLicense: function()
		{
			licenseLength--;
		},
		getActualPopularity: function()
		{
			return actualPopularity;
		},
		getCostLicense: function()
		{
			return costLicense;
		},
		getExpectedPopularity: function()
		{
			return expectedPopularity;
		},
		getLicenseLength: function()
		{
			return licenseLength;
		},
		getOptimalSeason: function()
		{
			return optimalSeason;
		},
		getProducedBy: function()
		{
			return producedBy;
		},
		getSynopsis: function()
		{
			return synopsis;
		},
		getTitle: function()
		{
			return title;
		},
		getWorstSeason: function()
		{
			return worstSeason;
		}
	};
};

var createSalon = function()
{
	var isMoviePlaying = false;
	var maxSeats = 100;
	var maxUpgradeLevel = 10;
	var moviePlaying = null;
	var projectorLevel = 1;
	var screenLevel = 1;
	var seats = 10;
	var seatCost = 200;
	var soundLevel = 1;
	var upgradeMultiplier = 300;	

	return {
		addSeats: function(quantity, balance)
		{
			if((balance + 9990) < (seatCost * quantity)) return balance;
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
		getMaxSeats: function()
		{
			return maxSeats;
		},
		getMaxUpgradeLevel: function()
		{
			return maxUpgradeLevel;
		},
		getMoviePlaying: function()
		{
			return moviePlaying;
		},
		getProjectorLevel: function()
		{
			return projectorLevel;
		},
		getScreenLevel: function()
		{
			return screenLevel;
		},
		getSeatCost: function()
		{
			return seatCost;
		},
		getSeatCost: function(quantity)
		{
			return (seatCost * quantity);
		},
		getSeats: function()
		{
			return seats;
		},
		getSoundLevel: function()
		{
			return soundLevel;
		},
		getTicketsSold: function(modifier, season)
		{
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
		getUpgradeMultiplier: function()
		{
			return upgradeMultiplier;
		},
		isMoviePlaying: function()
		{
			return isMoviePlaying;
		},
		setMoviePlaying: function(movie)
		{
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
		upgradeProjectorLevel: function(balance)
		{
			if(projectorLevel >= maxUpgradeLevel) projectorLevel = maxUpgradeLevel;
			else if( (projectorLevel + 1) * upgradeMultiplier <= (balance + 9990) )
			{
				balance -= (projectorLevel + 1) * upgradeMultiplier;
				projectorLevel++;
			}
			return balance;
		},
		upgradeScreenLevel: function(balance)
		{
			if(screenLevel >= maxUpgradeLevel) screenLevel = maxUpgradeLevel;
			else if( (screenLevel + 1) * upgradeMultiplier <= (balance + 9990) )
			{
				balance -= (screenLevel + 1) * upgradeMultiplier;
				screenLevel++;
			}
			return balance;
		},
		upgradeSoundLevel: function(balance)
		{
			if(soundLevel >= maxUpgradeLevel) soundLevel = maxUpgradeLevel;
			else if( (soundLevel + 1) * upgradeMultiplier <= (balance + 9990) )
			{
				balance -= (soundLevel + 1) * upgradeMultiplier;
				soundLevel++;
			}
			return balance;
		}
	}
};