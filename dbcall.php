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
    if ($_POST['action'] == "MakeShot") {
        MakeShot($_POST['session'], $_POST['playername'], $_POST['obstaclename'], $_POST['attempt'],$_POST['circle']);
    }
    if ($_POST['action'] == "GetShotsByPlayer") {
        GetShotsByPlayer($_POST['session'], $_POST['playername']);
    }
}
function ConnectToDb(){
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
    else{
        return $conn;
    }
}
function GetAllObstacles()
{
    $conn = ConnectToDb();

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
    $conn = ConnectToDb();

    $sql = "SELECT * from Parkour";
    $result = $conn->query($sql);
    $Parkours = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $Parkours[intval($row["parkour_id"])] = $row["name"];
        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($Parkours);
}

function GetObstacleByParkour($parkourName)
{
    $conn = ConnectToDb();

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
    $conn = ConnectToDb();

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
    $conn = ConnectToDb();

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
    $conn = ConnectToDb();

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
    $conn = ConnectToDb();

    //Get parkour id
    $sql = "SELECT parkour_id from parkour where name = '$parkour'";
    $result = $conn->query($sql);
    $parkourrow = mysqli_fetch_row($result);
    $parkourid = intval($parkourrow[0]);

    //Add session
    mysqli_query($conn, "INSERT into session (session_id, parkour_id) values ('$session', '$parkourid')");

    //Add users
    foreach ($users as $name) {
        mysqli_query($conn, "INSERT into player (firstname, lastname, nickname, session_id) values ('$name[0]', '$name[1]', '$name[2]', '$session')");
    }

    echo $session;
    $conn->close();
}

function MakeShot($session, $playername, $obstaclename, $attempt, $circle)
{
    $conn = ConnectToDb();

    //Get parkour id
    mysqli_query($conn, "insert into shot (session_id, obstacle_id, player_id, score_id) 
                    values ('$session', 
                    (select obstacle_id from obstacle where name = '$obstaclename'),
                    (select player_id from player where session_id = 1 and nickname = '$playername'),
                    (select score_id from score where attempt = '$attempt' and circle = '$circle'));");

    $conn->close();
}

function GetShotsByPlayer($session, $playername){
    $conn = ConnectToDb();

    $sql = "select points from shot sh, score sc, parkour_obstacle po
                where sh.obstacle_id = po.obstacle_id
                and sc.score_id = sh.score_id
                and po.parkour_id = (select parkour_id from session where session_id = '$session')
                AND session_id = '$session' and player_id = '$playername'
                order by obstacle_nr;";
    $result = $conn->query($sql);
    $points = array();

    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $points[] = $row["points"];

        }
    } else {
        echo "0 results";
    }
    $conn->close();
    echo json_encode($points);
}

?>
