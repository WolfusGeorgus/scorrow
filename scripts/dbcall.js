
function CheckParkourName(ParkourName) {
    let isUsed = false;
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "CheckParkourName", name: ParkourName},
        success: function (result) {
            if (result == "used"){
                isUsed = true;
            }
        }
    });
    return isUsed;
};
//CheckParkourName("Easy Parkour");

function CreateParkour(ParkourName, locationName, obstacleNames) {
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "CreateParkour", name: ParkourName, location: locationName, ids: JSON.stringify(obstacleNames)},
        success: function (result) {
        }
    });
};
//CreateParkour("Hello", new Array("Schaf", "Ziege"));

function CreateSession(sessionName, parkourName, userNames) {
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

function GetObstacleByParkour(parkourName) {
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
    return arr;
};

//var result = GetObstacleByParkour("Testing");
//for (var key in result) {
//    document.getElementById("testing").innerHTML += key + ": " + result[key] + "<br>";
//}

function GetNamesBySessionId(sessionId) {
    var arr = Array();
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "GetNamesBySessionId", sessionId: sessionId},
        success: function (result) {
            arr = JSON.parse(result);
        }
    });
    return arr;
};

function GetParkours() {
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
    return arr;
};
//GetParkours();

function GetAllObstacles() {
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
    return arr;
};

function makeShot(sessionId, playername, obstaclename, attempt, circle) {
    $.ajax({
        type: "POST",
        url: 'dbcall.php',
        async: false,
        data: {action: "MakeShot", session: sessionId, playername: playername, obstaclename: obstaclename, attempt: attempt, circle: circle},
        success: function (result) {
        }
    });
};

function InitiateGeorgTesting(){
    document.addEventListener('submit', validateForm);
    var obstacles = GetAllObstacles();

    for (var key in obstacles) {
        document.getElementById("select").innerHTML += "<option value=" + obstacles[key] + ">" + obstacles[key] + "</option>";// key + ": " + obstacles[key] + "<br>";
    };

    new DualListbox('.select1',{
        addEvent: function(value) {
            console.log(value);
        },
        removeEvent: function(value) {
            console.log(value);
        },
        availableTitle: 'Available options',
        selectedTitle: 'I want to use this',
        addButtonText: '>',
        removeButtonText: '<',
        addAllButtonText: '>>',
        removeAllButtonText: '<<'
    });

    let names = Array(Array("Georg", "Wolf", "Tschortsch"), Array("Rustam", "Eder", "Rusty"));
    let test = CreateSession("Hi", "Easy Parkour", names);
    let x = 1;

}

//var result = GetAllObstacles();
//for (var key in result) {
//    document.getElementById("testing").innerHTML += key + ": " + result[key] + "<br>";
//}