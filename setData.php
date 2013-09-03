<?php

//Get the action of post request.
$jsonAction = $_POST[action];
$jsonData =  $_POST[dataArray];

//Decode Json data to PHP array.
$arrayData = json_decode($jsonData, true);

//Open database connection.
$con = mysql_connect('localhost', 'root', 'root');

if (!$con){
    die('Could not connect: ' . mysql_error());
}

//Choose database.
mysql_select_db("Pond", $con);

//Process the data based on Action.
if($jsonAction == "setPads"){ 
    saveLilyPads($arrayData, $con);
}
else if($jsonAction == "setFlowers"){
	saveFlowers($arrayData, $con);	
}

//Save lily pads data to database.
function saveLilyPads($array, $c){
	$updateCount = sizeof($array);
	for($i = 0; $i < $updateCount; $i++){
		mysql_query("UPDATE	savedLeafs SET PosX = ".$array[$i]['PosX']." WHERE ID = ".($i + 1), $c);
		mysql_query("UPDATE	savedLeafs SET PosY = ".$array[$i]['PosY']." WHERE ID = ".($i + 1), $c);
		mysql_query("UPDATE	savedLeafs SET jointDistance = ".$array[$i]['jointDistance']." WHERE ID = ".($i + 1), $c);
	}
	echo "LilyPads Saved";	
}

function saveFlowers($array, $c){
	$updateCount = sizeof($array);
	for($i = 0; $i < $updateCount; $i++){
		mysql_query("UPDATE	savedFlowers SET PosX = ".$array[$i]['PosX']." WHERE ID = ".($i + 1), $c);
		mysql_query("UPDATE	savedFlowers SET PosY = ".$array[$i]['PosY']." WHERE ID = ".($i + 1), $c);
		mysql_query("UPDATE	savedFlowers SET expandStatus = ".$array[$i]['expandStatus']." WHERE ID = ".($i + 1), $c);
	}
}
 













