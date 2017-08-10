<?php
header("content-type:application/json");
include_once "config2.php";

$data = json_decode(file_get_contents("php://input"));

$title = $data->title;
$synopsis = $data->synopsis;
$expectedPopularity = $data->expectedPopularity;
$actualPopularity = $data->actualPopularity;
$optimalSeason = $data->optimalSeason;
$worstSeason = $data->worstSeason;
$costLicense = $data->costLicense;
$licenseLength = $data->licenseLength;
$producedBy = $data->producedBy;

// $movie = '{ ' .
// 				'"title": "' . $title . '",' .
// 				'"synopsis": "' . $synopsis . '",' .
// 				'"expectedPopularity": "' . $expectedPopularity . '",' .
// 				'"actualPopularity": "' . $actualPopularity . '",' .
// 				'"optimalSeason": "' . $optimalSeason . '",' .
// 				'"worstSeason": "' . $worstSeason . '",' .
// 				'"costLicense": "' . $costLicense . '",' .
// 				'"licenseLength": "' . $licenseLength . '",' .
// 				'"producedBy": "' . $producedBy . '"' .
// 			 ' }';
// 	print $movie;

// Create connection
$conn = new mysqli($hostnameMain, $usernameMain, $passwordMain, $dbnameMain);
// Check connection
if ($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}
// Checks to make sure all data is validated.
if(is_string($title))
{
	if($title === "") $title = "Untitled";
}
else $title = "Untitled";
if(is_string($synopsis))
{
	if($synopsis === "") $synopsis = "No synopsis given.";
}
else $synopsis = "No synopsis given.";
if(is_string($producedBy))
{
	if($producedBy === "") $producedBy = "Anonymous";
}
else $producedBy = "Anonymous";
if($expectedPopularity)
{
	if($expectedPopularity <= 0) $expectedPopularity = 0.1;
	if($expectedPopularity > 1) $expectedPopularity = 1.0;
}
else $expectedPopularity = 0.1;
if($actualPopularity)
{
	if($actualPopularity <= 0) $actualPopularity = 0.1;
	if($actualPopularity > 1) $actualPopularity = 1.0;
}
else $actualPopularity = 0.1;
if($costLicense)
{
	if($costLicense < 1000) $costLicense = 1000;
	if($costLicense > 100000) $costLicense = 100000;
}
else $costLicense = 1000;
if($optimalSeason)
{
	if($optimalSeason < 0) $optimalSeason = 0;
	if($optimalSeason > 3) $optimalSeason = 3;
}
else $optimalSeason = 0;
if($worstSeason)
{
	if($worstSeason < 0) $worstSeason = 0;
	if($worstSeason > 3) $worstSeason = 3;
}
else $worstSeason = 0;
if($licenseLength)
{
	if($licenseLength < 12) $licenseLength = 12;
	if($licenseLength > 52) $licenseLength = 52;
}
else $licenseLength = 0;

$date = date('Y-m-d H:i:s');

$sql = 'INSERT INTO Movies (`Title`, ' .
								'`Synopsis`, ' .
								'`Expected Popularity`, ' .
								'`Actual Popularity`, ' .
								'`Optimal Season`, ' .
								'`Worst Season`, ' .
								'`Cost License`, ' .
								'`License Length`, ' .
								'`Produced By`, ' .
								'`Date Created`, ' .
								'`Date Modified`) ' .
					'VALUES ("' . $title . '", "' .
									$synopsis . '", ' .
									$expectedPopularity . ', ' .
									$actualPopularity . ', ' .
									$optimalSeason . ', ' .
									$worstSeason . ', ' .
									$costLicense . ', ' .
									$licenseLength . ', "' .
									$producedBy . '", "' .
									$date . '", "' .
									$date . '")';

$res = $conn->query($sql);

if($res === TRUE)
{
	$movie = '{ ' .
				'"title": "' . $title . '",' .
				'"synopsis": "' . $synopsis . '",' .
				'"expectedPopularity": ' . $expectedPopularity . ',' .
				'"actualPopularity": ' . $actualPopularity . ',' .
				'"optimalSeason": ' . $optimalSeason . ',' .
				'"worstSeason": ' . $worstSeason . ',' .
				'"costLicense": ' . $costLicense . ',' .
				'"licenseLength": ' . $licenseLength . ',' .
				'"producedBy": "' . $producedBy . '"' .
			 ' }';
	print $movie;
}
else
{
	echo "{}";
}

$conn->close();
?>