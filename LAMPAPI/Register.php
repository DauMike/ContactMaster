<?php
include 'Functions.php';

$mysqli = new mysqli("localhost","student","studyhard","COP4331");
$inData = getRequestInfo();

$FirstName = $inData["firstname"];
$LastName = $inData["lastname"];
$Login = $inData["login"];
$Password = $inData["password"];


// Check connection
if ($mysqli->connect_error) 
{
	ReturnWithError($mysqli->connect_error);
}
else
{
	// Perform query
	if ($result = $mysqli->query("SELECT * FROM Users WHERE Login='$Login';")) 
  	{
		if($result->num_rows > 0)
		{
			returnWithError("Username exists already! Please select another one!");
      	}
		else
		{
			$stmt = $mysqli->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?);");
			$stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
			$stmt->execute();
			#returnWithInfo(1);

			echo json_encode("Registration Complete!");

		}
      
		// Free result set
		$result -> free_result();
	}
	else
	{
		returnWithError($mysqli->error);
	} 

	$stmt->close();
	$mysqli->close();
}
?>
