<?php
  $mysqli = new mysqli("localhost","Student","studyhard","COP4331");
  $inData = getRequestInfo();

  $login = $inData['login'];
  // Check connection
  if ($mysqli->connect_error) {
    returnWithError($mysqli->connect_error);
  }
  else
  {
    // Perform query
    if ($result = $mysqli->query("SELECT * FROM Users WHERE Login='$login';")) 
    {
      if($result->num_rows > 0)
      {
        returnWithError("Username exists already! Please select another one!");
      }
      else
      {
        $stmt = $mysqli->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?);");
		    $stmt->bind_param("ssss", $inData['firstname'], $inData['lastname'], $login, $inData['password']);
		    $stmt->execute();

        echo json_encode("User created! Please Enjoy!");
      }
      
      // Free result set
      $result -> free_result();
    }
    else
    {
      returnWithError($mysqli->error);
    } 

    $stmt->close();
    $mysqli->close();
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>