export function CheckParkourName(ParkourName) {

    let isUsed = false;
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "CheckParkourName", name: ParkourName},
        success: function (result) {
            if (result == "used") {
                isUsed = true;
            }
        }
    });
    return isUsed;
};

export function CreateParkour(ParkourName, locationName, obstacleNames) {
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "CreateParkour", name: ParkourName, location: locationName, ids: JSON.stringify(obstacleNames)},
        success: function (result) {
        }
    });
};

export function CreateSession(sessionName, parkourName, userNames) {
    var sessionId;
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "CreateSession", session: sessionName, parkour: parkourName, users: JSON.stringify(userNames)},
        success: function (result) {
            sessionId = result;
        }
    });
    return sessionId;
};

export function GetObstacleByParkour(parkourName) {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetObstacleByParkour", name: parkourName},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return Object.values(arr);
};

//var result = GetObstacleByParkour("Testing");
//for (var key in result) {
//    document.getElementById("testing").innerHTML += key + ": " + result[key] + "<br>";
//}

export function GetNamesBySessionId(session) {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetNamesBySessionId", session: session},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return Object.values(arr);
}

export function GetParkours() {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetParkour"},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return Object.values(arr);
};

function GetParkourBySession(session) {
    var parkour = "test";
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetParkourBySession", session: session},
        success: function (result) {
            parkour = result;
        }
    });
    return parkour;
};

export function GetAllObstacles() {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetAllObstacles"},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return Object.values(arr);
};

export function makeShot(sessionId, playername, obstaclename, attempt, circle) {
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {
            action: "MakeShot",
            session: sessionId,
            playername: playername,
            obstaclename: obstaclename,
            attempt: attempt,
            circle: circle
        },
        success: function (result) {
        }
    });
};

function GetShotsByPlayer(session, playername) {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetShotsByPlayer", session: session, playername: playername},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return Object.values(arr);
};

