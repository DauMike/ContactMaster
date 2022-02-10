<?php
	include 'Functions.php';

	$inData = getRequestInfo();
	
	$UserID = $inData["userid"];
	$FirstName = $inData["firstname"];
	$LastName = $inData["lastname"];
	$Email = $inData["email"];
	$Phone = $inData["phone"];

	$conn = db_connection();
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID) VALUES (?,?,?,?,?);");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Email, $Phone, $UserID);
		$flag = $stmt->execute();
		$id = -1;
		if($flag) {
			$id = $conn->insert_id;
		}
		$stmt->close();
		$conn->close();
		echo json_encode(array("newId" => $id));//("Contact created! Please Enjoy!");
	}

?>
