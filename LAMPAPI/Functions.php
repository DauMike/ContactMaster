<?php

    function db_connection() {
        return new mysqli("localhost", "student", "studyhard", "COP4331");
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

    function returnWithUserInfo( $firstName, $lastName, $id)
    {
        $retValue   = '{"firstName": ["' . $firstName . '"],"lastName": ["' . $lastName . '"],"id":["' . $id . '"]}';
    //    $retValue = '{"firstNames": [' . $firstNames . ']}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo($cids, $firstNames, $lastNames, $emails, $phoneNumbers, $searchCount )
    {
        $retValue   = '{"contactCount": [' . $searchCount . '],"firstNames":[' . $firstNames . '],"lastNames":[' . $lastNames . '],"emails":[' . $emails . '],"phoneNumbers":[' . $phoneNumbers . '],"cid":[' . $cids . ']}';
    //    $retValue = '{"firstNames": [' . $firstNames . ']}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        die(1);
    }    
?>
