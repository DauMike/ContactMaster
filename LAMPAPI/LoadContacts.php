<?php

    include("Functions.php");
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;
    $cIds = "";
    $firstNames = "";
    $lastNames = "";
    $emails = "";
    $phoneNumbers = "";

    $conn = db_connection();
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT id, FirstName, LastName , Email, Phone FROM Contacts WHERE UserID = ?");
        $stmt->bind_param("s", $inData["userid"]);
        $stmt->execute();
        $result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $cIds .= ",";
                $firstNames .= ",";
                $lastNames .= ",";
                $emails .= ",";
                $phoneNumbers .= ",";

            }
            $searchCount++;
            $cIds .= '"'.$row["id"].'"';
            $firstNames .= '"'.$row["FirstName"] .'"';
            $lastNames .= '"'.$row["LastName"] .'"';
            $emails .= '"'.$row["Email"] .'"';
            $phoneNumbers .= '"'.$row["Phone"] .'"';        
    }
    
    $stmt->close();
    $conn->close();

    if( $searchCount == 0 )
    {
        returnWithError( "No Records Found" );
    }
    else
    {
        returnWithInfo( $cIds, $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount );
        //sendResultInfoAsJSON(json_encode($result));
    }   
    }  
?>