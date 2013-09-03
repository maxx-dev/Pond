<?php

//Get the action of post request.
$jsonAction = $_POST[action];
$jsonSource = $_POST[dataSource]; 

//Open connection.
$con = mysql_connect('localhost', 'root', 'root');

if (!$con){
    die('Could not connect: ' . mysql_error());
}

//Choose database.
mysql_select_db("Pond", $con);

//Get required data.
if($jsonSource == "Original"){
	$lilyPads = mysql_query("select * from Leafs", $con);
	$flowers = mysql_query("select * from Flowers", $con);
}
else if($jsonSource == "Saved"){
	$lilyPads = mysql_query("select * from savedLeafs", $con);
	$flowers = mysql_query("select * from savedFlowers", $con);
}

//Put data in array.
$i = 0; $lilyPadsJson = null; $flowersJson = null;
while($row = mysql_fetch_array($lilyPads)){
	$lilyPadsJson[$i] = $row;
	$i++; 
}
$i = null;

$i=0;
while($row = mysql_fetch_array($flowers)){
	$flowersJson[$i] = $row;
	$i++; 
}
$i = null;

//Post to front-end. 
if($jsonAction == "getPads"){ 
    echo json_encode($lilyPadsJson);
}
else if($jsonAction == "getFlowers"){
	echo json_encode($flowersJson);
}






