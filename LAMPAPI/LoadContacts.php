<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "student", "studyhard", "COP4331");
if($conn->connection_error)
{
	returnWithError($conn->connection_error);
}
else
{
   $stmt = $conn->prepare("SELECT FirstName, LastName , Email, Phone FROM Contacts WHERE UserID = ?");
   $stmt->bind_param("s", $inData["userid"]);
   $stmt->execute();


   $result = $stmt->get_result();
/*
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
       returnWithError( "No Records Found" );
    }
    else
    {
        returnWithInfo( $searchResults );
    }*/
    while($row = $result->fetch_assoc())
    {
      returnWithInfo( $row['FirstName'], $row['LastName'], $row['Email'], $row['Phone']);
      $searchCount++;
    }

    $stmt->close();
    $conn->close(); 
}


function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
/*
function returnWithInfo( $searchResults )
{
    $retValue = '{"results":[' . $searchResults . ']}';
    sendResultInfoAsJson( $retValue );

}  */
function returnWithInfo( $firstName, $lastName, $Email, $Phone )
{
    $retValue = '{'.$row["FirstName"] . ' ' . $row["LastName"] . ' ' . $row["Email"]. ' ' . $row["Phone"].'}';
 // $retValue = '{' . $firstName . $lastName . $Email . $Phone .'}';
 // $searchResults .= '"'.$row["FirstName"] . ' ' . $row["LastName"] . ' ' . $row["Email"]. ' ' . $row["Phone"].'"';
    sendResultInfoAsJson( $retValue );
} 
?>