<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;
$firstNames = "";
$lastNames = "";
$emails = "";
$phoneNumbers = "";

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
    }
    while($row = $result->fetch_assoc())
    {
      returnWithInfo( $row['FirstName'], $row['LastName'], $row['Email'], $row['Phone']);
      $searchCount++;
    }

    if( $searchCount == 0 )
    {
       returnWithError( "No Records Found" );
    }
    $stmt->close();
    $conn->close(); 
}*/

while($row = $result->fetch_assoc())
{
    if( $searchCount > 0 )
    {
        $firstNames .= ",";
        $lastNames .= ",";
        $emails .= ",";
        $phoneNumbers .= ",";

    }
    $searchCount++;
    $firstNames .= '"'.$row["FirstName"] .'"';
    $lastNames .= '"'.$row["LastName"] .'"';
    $emails .= '"'.$row["Email"] .'"';
    $phoneNumbers .= '"'.$row["Phone"] .'"';
   }

 if( $searchCount == 0 )
 {
    returnWithError( "No Records Found" );
 }
 else
 {
     returnWithInfo( $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount );
 }
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
    $retValue = '{"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount )
{
    $retValue   = '{"contactCount": [' . $searchCount . '],"firstNames":[' . $firstNames . '],"lastNames":[' . $lastNames . '],"emails":[' . $emails . '],"phoneNumbers":[' . $phoneNumbers . ']}';
    sendResultInfoAsJson( $retValue );
}

?>