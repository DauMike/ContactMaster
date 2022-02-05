<?php

//include 'Functions.php';

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
//	$result = $conn->query("SELECT * FROM Contacts WHERE UserID ='$UserID';")
   $stmt = $conn->prepare("SELECT FirstName, LastName/*, Email, Phone*/ FROM Contacts WHERE UserID = ?");
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
       $searchResults .= '"'.$row["FirstName"] . ' ' . $row["LastName"] .'"';
      }

    if( $searchCount == 0 )
    {
       returnWithError( "No Records Found" );
    }
    else
    {
        returnWithInfo( $searchResults );
    }

    stmt->close();

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

function returnWithInfo( $searchResults )
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson( $retValue );

}   
?>