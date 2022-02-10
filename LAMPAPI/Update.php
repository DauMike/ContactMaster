<?php

    include 'Functions.php';

    $inData = getRequestInfo();

    //$UserID = $inData["userid"];
    $CID = $inData["cid"];
    $FirstName = $inData["firstname"];
    $LastName = $inData["lastname"];
    $Email = $inData["email"];
    $Phone = $inData["phone"];

    $conn = db_connection();

    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        if ($result = $conn->query("SELECT * FROM Contacts WHERE id='$CID';"))/*Phone='$Phone';")) */
        {
            if ($result->num_rows == 0)
            {
                returnWithError("Contact does not exist!");
            }
            else
            {
                $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE id=? ");//UserID=? AND Phone=? ");
                $stmt->bind_param("sssss", $FirstName, $LastName, $Phone, $Email, $CID);
                $res = "Contact updated! Please Enjoy!";
                if(!$stmt->execute())        
                    $res = "Updating failed!";                    
                
                $stmt->close();
                $conn->close();
                echo json_encode($res);
            }
        }
    }
?>
