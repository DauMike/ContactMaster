<?php
	
   $inData = getRequestInfo();
  
   $searchResults = "";
   $searchCount = 0;
   $firstNames = "";
   $lastNames = "";
   $emails = "";
   $phoneNumbers = "";
 
   $conn = new mysqli("localhost", "student", "studyhard", "COP4331");
   if ($conn->connect_error)
   {
       returnWithError( $conn->connect_error );
   }
   else
   {
       $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE CONCAT_WS(' ',FirstName,LastName) LIKE ? AND UserID=?");
       $Name = "%" . $inData["search"] . "%";
       $stmt->bind_param("ss", $Name, $inData["userid"]);
       $stmt->execute();
     
       $result = $stmt->get_result();
     
       while($row = $result->fetch_assoc())
       {
           if( $searchCount > 0 )
           {
               $ID .= ",";
               $firstNames .= ",";
               $lastNames .= ",";
               $emails .= ",";
               $phoneNumbers .= ",";
           }
           $searchCount++;
           $ID .= '"'.$row["ID"] .'"';
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
           returnWithInfo( $ID, $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount );
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
  
   function returnWithInfo( $ID, $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount )
   {
    $retValue   = '{"contactCount": [' . $searchCount . '],"cId":[' . $ID . '],"firstNames":[' . $firstNames . '],"lastNames":[' . $lastNames . '],"emails":[' . $emails . '],"phoneNumbers":[' . $phoneNumbers . ']}';
    sendResultInfoAsJson( $retValue );
    }

?>
