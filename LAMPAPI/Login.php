
<?php
include 'Functions.php';

$inData = getRequestInfo();

$Login = $inData["login"];
$Password = $inData["password"];

$id = 0;
$firstName = "";
$lastName = "";

$conn = db_connection();
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
    $stmt->bind_param("ss", $Login, $Password);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();    
    $stmt->close();
    $conn->close();
    if($row)
    {
        returnWithUserInfo( $row['firstName'], $row['lastName'], $row['ID'] );
    }
    else
    {
        returnWithError("No Records Found");
    }
}
?>
