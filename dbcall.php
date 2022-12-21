<?php

if (isset($_POST['action'])) {
    if ($_POST['action'] == "GetAllObstacles") {
        GetAllObstacles();
    }
    if ($_POST['action'] == "GetParkour") {
        GetParkour();
    }
    if ($_POST['action'] == "GetObstacleByParkour") {
        GetObstacleByParkour($_POST['name']);
    }
    if ($_POST['action'] == "GetNamesBySessionId") {
        GetNicknamesBySessionId($_POST['sessionId']);
    }
    if ($_POST['action'] == "CheckParkourName") {
        CheckParkourName($_POST['name']);
    }
    if ($_POST['action'] == "CreateParkour") {
        CreateParkour($_POST['name'], $_POST['location'], json_decode($_POST["ids"]));
    }
    if ($_POST['action'] == "CreateSession") {
        CreateSession($_POST['session'], $_POST['parkour'], json_decode($_POST["users"]));
    }
}

function GetAllObstacles()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM obstacle";
    $result = $conn->query($sql);
    $obstacles = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $obstacles[intval($row["obstacle_id"])] = $row["name"];

        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($obstacles);
}

function GetParkour()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * from Parkour";
    $result = $conn->query($sql);
    $Parkours = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $Parkours[] = $row["name"];

        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($Parkours);
}

function GetObstacleByParkour($parkourName)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT o.obstacle_id, o.name, po.obstacle_nr FROM obstacle o, parkour_obstacle po, parkour p WHERE
    o.obstacle_id = po.obstacle_id AND po.parkour_id = p.parkour_id AND p.name = '$parkourName' order by po.obstacle_nr";
    $result = $conn->query($sql);
    $obstacles = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $obstacles[intval($row["obstacle_id"])] = $row["name"];

        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($obstacles);
}

function GetNicknamesBySessionId($sessionId)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT p.nickname FROM player p WHERE session_id = '$sessionId'";
    $result = $conn->query($sql);
    $names = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $names[] = $row["nickname"];

        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($names);
}

function CheckParkourName($name)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";
// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * from Parkour where name = '$name'";
    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        echo "not used";
    } else {
        echo "used";
    }
    $conn->close();
}

function CreateParkour($name, $location, $obstaclenames)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";

// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    mysqli_query($conn, "INSERT into Parkour (name, location) values ('$name', '$location')");
    $last_id = $conn->insert_id;

    $ids_array = array();
    $sql = "SELECT * from obstacle where name in ('" . implode("','", $obstaclenames) . "')";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $ids_array[] = $row["obstacle_id"];
    }

    for ($i = 0; $i < count($ids_array); $i++) {
        mysqli_query($conn, "INSERT into Parkour_obstacle (Parkour_id, obstacle_id, obstacle_nr) values ('$last_id', '$ids_array[$i]', '$i')");
    }
    $conn->close();
}

function CreateSession($session, $parkour, $users)
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scorrow";

// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Get parkour id
    $sql = "SELECT parkour_id from parkour where name = '$parkour'";
    $result = $conn->query($sql);
    $parkourrow = mysqli_fetch_row($result);
    $parkourid = intval($parkourrow[0]);

    //Add session
    mysqli_query($conn, "INSERT into session (name, parkour_id) values ('$session', '$parkourid')");
    $last_id = intval($conn->insert_id);

    //Add users
    foreach ($users as $name) {
        mysqli_query($conn, "INSERT into player (firstname, lastname, nickname, session_id) values ('$name[0]', '$name[1]', '$name[2]', '$last_id')");
    }

    echo $last_id;
    $conn->close();
}

?>
