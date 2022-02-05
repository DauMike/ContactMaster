<?php

include 'Functions.php';

$inData = getRequestInfo();

$conn = new mysqli("localhost", "student", "studyhard", "COP4331");

if($conn->connection_error)
{
	returnWithError($conn->connection_error);
}
else
{
//	$result = $conn->query("SELECT * FROM Contacts WHERE UserID ='$UserID';")
   $stmt = $conn->prepare("SELECT FirstName, LastName, Email, Phone FROM Contacts WHERE UserId = ?");
   $stmt->bind_param("s", $inData["userid"]);
   $stmt->execute();
   $result = $stmt->get_result();

   while($row = $result->fetch_assoc())
   {
       if( $searchCount > 0 )
       {
           $searchResults .= ",";
       }
       $searchCount++;
       $searchResults .= '"'.$row["FirstName"] . ' ' . $row["LastName"] . ' ' . $row["Email"]. ' ' . $row["Phone"].'"';
   }

    if( $searchCount == 0 )
    {
        returnWithinfo( "No Contacts" );
    }
    else
    {
        returnWithInfo( $searchResults );
    }

   $stmt->close();
   $conn->close(); 
}
   ?>