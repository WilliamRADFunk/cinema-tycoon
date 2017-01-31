<?php
header("content-type:application/json");
include_once "config.php";

// Create connection
$conn = new mysqli($hostnameMain, $usernameMain, $passwordMain, $dbnameMain);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}
// Get number of rows in Movie table
$sql = "SELECT COUNT(*) FROM `Movies`";
$result = $conn->query($sql);

if(!$result || $result->fetch_array(MYSQLI_ASSOC)["COUNT(*)"] < 3)
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
		$index = rand(1, $result->fetch_array(MYSQLI_ASSOC)["COUNT(*)"]);
		$sql = "SELECT `ID` FROM `Movies` WHERE `ID`=" . $index;
		$res = $conn->query($sql);
		$movIndex = $res->fetch_array(MYSQLI_ASSOC);
		if($movIndex["ID"] > 0)
		{
			array_push($indexList, $index);
			$counter++;
		}
		else
		{
			break;
		}
	}while($counter < 3);

	$sql = "SELECT * FROM Movies WHERE `ID`=" . $indexList[0] . " OR `ID`=" . $indexList[1] . " OR `ID`=" . $indexList[2];
	$MovieResults = $conn->query($sql);

	$movies = '{"movies":[';
	while ( $db_row = $MovieResults->fetch_array(MYSQLI_ASSOC) )
	{
		$movies .=  '{"title":"' . $db_row['title'] .
					'", "synopsis":' . $db_row['synopsis'] .
					'", "expectedPopularity":' . $db_row['Expected Popularity'] .
					'", "actualPopularity":' . $db_row['Actual Popularity'] .
					'", "optimalSeason":' . $db_row['Optimal Season'] .
					'", "worstSeason":' . $db_row['Worst Season'] .
					'", "costLicense":' . $db_row['Cost License'] .
					'", "licenseLength":' . $db_row['License Length'] .
					'", "producedBy":' . $db_row['Produced By'] .
					'},';
	}
	$movies = rtrim($movies, ",");
	$movies .= ']}';
	print $movies;
}

$conn->close();
?>