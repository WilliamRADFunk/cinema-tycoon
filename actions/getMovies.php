<?php
header("content-type:application/json");
include_once "config2.php";

// Create connection
$conn = new mysqli($hostnameMain, $usernameMain, $passwordMain, $dbnameMain);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}
// Get number of rows in Movie table
$sql = "SELECT `ID` FROM `Movies` ORDER BY ID DESC LIMIT 1";
$result = $conn->query($sql);
$rows = $result->fetch_array(MYSQLI_ASSOC)["ID"];
// Makes sure $results came back good, and that it had at least 3 rows.
if(!$result || $rows < 3)
{
	print '{"movies":[]}';
}
else
{
	// Gets three valid movie index numbers at random.
	$counter = 0;
	$indexList = [];
	do
	{
		$index = rand(1, $rows);
		$sql = "SELECT `ID` FROM `Movies` WHERE `ID`=" . $index;
		$res = $conn->query($sql);
		$movIndex = $res->fetch_array(MYSQLI_ASSOC);
		// Must be a unique, valid index number.
		if($movIndex["ID"] > 0 && !in_array($index, $indexList))
		{
			array_push($indexList, $index);
			$counter++;
		}
	} while($counter < 3);
	// Get the three movies to which the index numbers, aka IDs, belong.
	$sql = "SELECT * FROM Movies WHERE `ID`=" . $indexList[0] . " OR `ID`=" . $indexList[1] . " OR `ID`=" . $indexList[2];
	$MovieResults = $conn->query($sql);
	// Makes sure the results come back properly before trying to use them.
	if(!$MovieResults)
	{
		print '{"movies":[]}';
	}
	else
	{
		// Construct the json string with the content of the three movies retrieved.
		$movies = '{"movies":[';
		while ( $db_row = $MovieResults->fetch_array(MYSQLI_ASSOC) )
		{
			$movies .=  '{' .
							'"title": "' . $db_row['Title'] . '", ' .
							'"synopsis": "' . $db_row['Synopsis'] . '", ' . 
							'"expectedPopularity": ' . $db_row['Expected Popularity'] . ', ' .
							'"actualPopularity": ' . $db_row['Actual Popularity'] . ', ' .
							'"optimalSeason": ' . $db_row['Optimal Season'] . ', ' .
							'"worstSeason": ' . $db_row['Worst Season'] . ', ' .
							'"costLicense": ' . $db_row['Cost License'] . ', ' .
							'"licenseLength": ' . $db_row['License Length'] . ', ' .
							'"producedBy": "' . $db_row['Produced By'] . '"' .
						'},';
		}
		$movies = rtrim($movies, ",");
		$movies .= ']}';
		// Send the json back.
		print $movies;
	}
}
// Close the connection.
$conn->close();
?>