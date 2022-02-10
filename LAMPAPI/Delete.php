<?php

include 'Functions.php';

$inData = getRequestInfo();

$UserID = $inData["userid"];
$CIDs = $inData["cIds"];

$conn = db_connection();

if($conn->connect_error)
{
	returnWithError($conn->connect_error);
}
else
{
	$stmt = $conn->prepare("DELETE FROM Contacts Where UserID=? AND ? LIKE CONCAT('%,', id, ',%')");
	$stmt->bind_param("ss", $UserID, $CIDs);		
	$flag = $stmt->execute();		
	$stmt->close();
	
	$conn->close();
	if(!$flag)
		returnWithError("Deleting failed!");
	else		
		echo json_encode("Contact deleted!!");		
}
?>
