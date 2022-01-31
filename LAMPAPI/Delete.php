<?php

include 'Functions.php';

$inData = getRequestInfo();

$UserID = $inData["userid"];
$Phone = $inData["phone"];

$conn = new mysqli("localhost", "student", "studyhard", "COP4331");

if($conn->connection_error)
{
	returnWithError($conn->connection_error);
}
else
{
	if($result = $conn->query("SELECT * FROM Contacts WHERE Phone='$Phone';"))
	{
		if($result->num_rows == 0)
		{
			returnWithError("Contact does not exist!");
		}
		else
		{
			$stmt = $conn->prepare("DELETE FROM Contacts Where Phone=? ");
			$stmt->bind_param("s", $Phone);
			$stmt->execute();

			$stmt->close();
			$conn->close();
			echo json_encode("Contact deleted!!");

		}
	}
}
?>
