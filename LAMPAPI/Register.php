<?php
    
$inData = getRequestInfo();
$conn = new mysqli("localhost", "student", "studyhard", "COP4331");

if($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else 
{
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
    $stmt->execute();

    if($row->affected_rows == 0)
    {
        returnWithError("Username already exists! Try a new one!");
    }
    else
    {
        returnWithInfo($conn->insert_id);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>