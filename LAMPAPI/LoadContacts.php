<?php

include 'Functions.php';

$inData = getRequestInfo();

$UserID = $inData["userid"];

$conn = new mysqli("localhost", "student", "studyhard", "COP4331");

if($conn->connection_error)
{
	returnWithError($conn->connection_error);
}
else
{
	$result = $conn->query("SELECT * FROM Contacts WHERE UserID ='$UserID';")

	while($rows=$result->fetch_assoc())
                {
             php echo $rows['FirstName'];
             php echo $rows['LastName'];
             php echo $rows['Email'];
             php echo $rows['Phone'];
                }

   $mysqli->close(); 
?>