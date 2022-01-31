<?php

include 'Functions.php';

$inData = getRequestInfo();

$UserID = $inData["userid"];
$FirstName = $inData["firstname"];
$LastName = $inData["lastname"];
$Email = $inData["email"];
$Phone = $inData["phone"];

$conn = new mysqli("localhost", "student", "studyhard", "COP4331");

if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    if ($result = $conn->query("SELECT * FROM Contacts WHERE Phone='$Phone';")) 
    {
        if ($result->num_rows == 0)
        {
            returnWithError("Contact does not exist!");
        }
        else
        {
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=? WHERE UserID=? AND Phone=? ");
            $stmt->bind_param("sssss", $FirstName, $LastName, $Email, $UserID, $Phone);
            $stmt->execute();   
            $stmt->close();
            $conn->close();
            echo json_encode("Contact updated! Please Enjoy!");
        }
    }
}
?>
