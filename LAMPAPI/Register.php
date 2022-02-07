<?php
	include 'Functions.php';

	$mysqli = mysqli_connect("localhost","student","studyhard","COP4331");
	$inData = getRequestInfo();
    $firstName = $inData["firstname"];
	$lastName = $inData["lastname"];
	$login = $inData["login"];
    $password = $inData["password"]; 
    
    if(mysqli_connect_errno())
    {
        returnWithError($mysqli->connect_error);
    }
    else
    {
        if(!isset($firstName, $lastName, $login, $password))
        {
            exit('Please complete the registration form!');
        }
        if(empty($firstName) || empty($lastName) || empty($login) || empty($password))
        {
            exit('Please complete the registration form!');
        }

        if($stmt = $mysqli->prepare("SELECT ID, Password FROM Users WHERE Login=?"))
        {
            $stmt->bind_param("s", $login);
            $stmt->execute();
            $stmt->store_result();

            if($stmt->num_rows > 0)
            {
                returnWithError("Username exists already! Please select another one!"); 
            }
            else
            {
                $stmt = $mysqli->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?);");
		        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		        $stmt->execute();

                echo json_encode("User created! Please Enjoy!");
            }

            $stmt->close();
        }

        $mysqli->close();
    }
?>
