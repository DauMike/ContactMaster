<?php
	include 'Functions.php';

	$inData = getRequestInfo();
	
	$UserID = $inData["userid"];
	$FirstName = $inData["firstname"];
	$LastName = $inData["lastname"];
	$Email = $inData["email"];
	$Phone = $inData["phone"];

	$conn = new mysqli("localhost", "student", "studyhard", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID) VALUES (?,?,?,?,?);");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Email, $Phone, $UserID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		echo json_encode("Contact created! Please Enjoy!");
	}

?>
