import * as dbcall from './dbcall.js';

var myChart;
var user;
var counttype = 2;

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("#teilnehmerTable td:last-child").html();
    // Append table with add row form on add new button click
    $(".add-new").click(function () {
        $(this).attr("disabled", "disabled");
        var index = $("#teilnehmerTable tbody tr:last-child").index();
        var row = '<tr>' +
            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
            '<td><input type="text" class="form-control" name="department" id="department"></td>' +
            '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
            '<td>' + actions + '</td>' +
            '</tr>';
        $("#teilnehmerTable").append(row);
        $("#teilnehmerTable tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
    // Add row on add button click
    $(document).on("click", ".add", function () {
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function () {
            if (!$(this).val()) {
                $(this).addClass("error");
                empty = true;
            } else {
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if (!empty) {
            input.each(function () {
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Edit row on edit button click
    $(document).on("click", ".edit", function () {
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function () {
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        $(this).tooltip('dispose');
    });
});

function validateParkourForm(ev) {
    let parkourName = document.getElementById("parkour-input").value;
    let location = document.getElementById("parkourOrt-input").value;
    if (!dbcall.CheckParkourName(parkourName)) {
        let obstacles = $("#select option:selected").map(function () {
            return this.value;
        }).get();
        dbcall.CreateParkour(parkourName, location, obstacles, user["user_id"]);
        ev.preventDefault();
        var parkours = dbcall.GetParkourByUserId(user["user_id"]);
        let i = 0;
        document.getElementById("parkourDropdown").innerHTML = "";
        for (var key in parkours) {
            if (i = 0) {
                document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "' selected>" + parkours[key] + "</option>";
            } else {
                document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "'>" + parkours[key] + "</option>";
            }
        }
    } else {
        ev.preventDefault();
        alert("Parkour Name already used");
    }

}

let sessionID = 0;
let parkourNameSpiel;

$("#sessionAnlegenModalButton").click(function () {
    $('#parkourModalcloseBtn').trigger("click");
    $('html, body').animate({
        scrollTop: $("#teilnehmer").offset().top
    }, 200);
});


function validateSessionForm(ev) {
    let parkour = document.getElementById("parkourDropdown");
    let parkourName = parkour.options[parkour.selectedIndex].text;
    parkourNameSpiel = parkourName;
    sessionID = document.getElementById("sessionId").value;
    var table = document.getElementById('teilnehmerTable');
    const listOfMembers = [];
    for (var r = 1, n = table.rows.length; r < n; r++) {
        const listOfNames = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m - 1; c++) {
            listOfNames[c] = table.rows[r].cells[c].innerHTML;
        }

        listOfMembers[r - 1] = listOfNames;
    }

    if (document.getElementById("pfeilewertungDropdown").value == "option2pfeilewertung")
    {
        counttype = 2;
    }
    else if (document.getElementById("pfeilewertungDropdown").value == "option3pfeilewertung")
    {
        counttype = 3;
    }

    let session = dbcall.CreateSession(sessionID, parkourName, listOfMembers);
    document.getElementById("sessionId").value = Math.random().toString(36).slice(2).substring(5);
}

$("#spielStartenModalButton").click(function () {
    $('#modalcloseBtn').trigger("click");
    $('html, body').animate({
        scrollTop: $("#spiel").offset().top
    }, 200);
});

window.onload = function () {
    var submitParkour = document.getElementById("parkourAnlegenBTN");
    var submitSession = document.getElementById("sessionAnlegenBTN");
    submitParkour.addEventListener("click", validateParkourForm);
    submitSession.addEventListener("click", validateSessionForm);
    var obstacles = dbcall.GetAllObstacles();

    let url = new URL(window.location.href)
    let params = new URLSearchParams(url.search);
    let user_nickname = params.get('User');
    if (user_nickname == null){
        window.location.href = "./login.html";
    }

    user = dbcall.GetUserByNickname(user_nickname);

    InsertUser();

    for (var key in obstacles) {
        document.getElementById("select").innerHTML += "<option value=" + obstacles[key] + ">" + obstacles[key] + "</option>";// key + ": " + obstacles[key] + "<br>";
    }
    ;

    new DualListbox('.select1', {
        addEvent: function (value) {
            console.log(value);
        },
        removeEvent: function (value) {
            console.log(value);
        },
        availableTitle: 'Available options',
        selectedTitle: 'I want to use this',
        addButtonText: '>',
        removeButtonText: '<',
        addAllButtonText: '>>',
        removeAllButtonText: '<<'
    });
    spielStarten();

    //Add parkours to create session part

    var parkours = dbcall.GetParkourByUserId(user["user_id"]);
    let i = 0;
    for (key in parkours) {
        if (i = 0) {
            document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "' selected>" + parkours[key] + "</option>";
        } else {
            document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "'>" + parkours[key] + "</option>";
        }
    }

    var sessionId = Math.random().toString(36).slice(2).substring(5);
    document.getElementById("sessionId").value = sessionId;
}

/*---------------Game-----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
let run = true;
let userPoints = 0;
let shoot = "";
let shootInNum = 1;
let playerNum = 0;
let playerMax;
let point = 0;
let hit = true;
let obstacleNum = 0;

let blue = document.getElementById('blue'),
    red = document.getElementById('red'),
    gold = document.getElementById('gold'),
    targetBoard = document.getElementById('targetBoard'),
    startButton = document.getElementById('startButton'),
    obstaclesSpiel,
    playerNames;

function spielStarten() {
    startButton.addEventListener('click', spielRun)
}

function spielRun() {
    GetGraph(sessionID);
    document.getElementById("tracker").style.display = "block";
;
    if (run) {
        blue.addEventListener('click', targetHit);
        red.addEventListener('click', targetHit);
        gold.addEventListener('click', targetHit);
        targetBoard.addEventListener('click', targetHit);
        obstaclesSpiel = dbcall.GetObstacleByParkour(parkourNameSpiel);
        playerNames = dbcall.GetNamesBySessionId(sessionID);
        playerMax = playerNames.length;
        document.getElementById(`animal`).innerText = obstaclesSpiel[obstacleNum];
        document.getElementById(`spielerName`).innerText = playerNames[playerNum];


        for (let i = 0; i < playerMax; i++) {
            var row = '<tr>' +
                '<td>' + `${playerNames[i]}` + '</td>\n' +
                '<td id=' + `hit${i}` + '></td>\n' +
                '<td id=' + `point${i}` + '>0</td>' +
                '</tr>';

            $("#scoreBoard").append(row);
        }
        startButton.innerText = "Pause";
        run = false;
    } else {
        blue.removeEventListener('click', targetHit);
        red.removeEventListener('click', targetHit);
        gold.removeEventListener('click', targetHit);
        targetBoard.removeEventListener('click', targetHit)
        startButton.innerText = "Start";
        run = true;
    }
}

function targetHit(event) {
    if (playerMax > playerNum && obstacleNum < obstaclesSpiel.length) {
        switch (event.target.id) {
            case 'blue':
                point = getPoints(shootInNum, 2);
                document.getElementById(`point${playerNum}`).innerText = point;
                UpdateShot(sessionID, playerNames[playerNum], obstaclesSpiel[obstacleNum], shootInNum, 3, point);
                playerNum++;
                shootInNum = 1;
                shoot = "";
                if (playerMax == playerNum) {
                    nextObstacle();
                } else {
                    document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                }
                event.stopImmediatePropagation();
                break;
            case 'red':
                point = getPoints(shootInNum, 1);
                document.getElementById(`point${playerNum}`).innerText = point;
                UpdateShot(sessionID, playerNames[playerNum], obstaclesSpiel[obstacleNum], shootInNum, 2, point);
                playerNum++;
                shootInNum = 1;
                shoot = "";
                if (playerMax == playerNum) {
                    nextObstacle();
                } else {
                    document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                }
                event.stopImmediatePropagation();
                break;
            case 'gold':
                point = getPoints(shootInNum, 0);
                document.getElementById(`point${playerNum}`).innerText = point;
                UpdateShot(sessionID, playerNames[playerNum], obstaclesSpiel[obstacleNum], shootInNum, 1, point);
                playerNum++;
                shootInNum = 1;
                shoot = "";
                if (playerMax == playerNum) {
                    nextObstacle();
                } else {
                    document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                }
                event.stopImmediatePropagation();
                break;
            case 'targetBoard':
                point = 0;
                shoot += "X";
                if (shootInNum == counttype) {
                    UpdateShot(sessionID, playerNames[playerNum], obstaclesSpiel[obstacleNum], shootInNum, 0, point)
                    document.getElementById(`hit${playerNum}`).innerText = shoot;
                    playerNum++;
                    shoot = "";
                    shootInNum = 1;
                    if (playerMax == playerNum) {
                        nextObstacle();
                    } else {
                        document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                    }
                    event.stopImmediatePropagation();
                    break;
                }
                if (playerMax == playerNum) {
                    nextObstacle();
                } else {
                    document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                }
                shootInNum++;
                hit = false;
                document.getElementById(`hit${playerNum}`).innerText = shoot;
                event.stopImmediatePropagation();
                break;
        }
    }


}

function nextObstacle() {
    obstacleNum++;
    playerNum = 0;
    shoot = "";

    setTimeout(function () {
        if (obstacleNum < obstaclesSpiel.length) {
            document.getElementById(`animal`).innerText = obstaclesSpiel[obstacleNum];
            document.getElementById(`spielerName`).innerText = playerNames[playerNum];
            for (let i = 0; i < playerMax; i++) {
                document.getElementById(`hit${i}`).innerText = shoot;
                document.getElementById(`point${i}`).innerText = 0;
            }
        } else {
            blue.removeEventListener('click', targetHit);
            red.removeEventListener('click', targetHit);
            gold.removeEventListener('click', targetHit);
            targetBoard.removeEventListener('click', targetHit)
            startButton.innerText = "Ergebnis";
            GetResults(sessionID);
            run = true;
            for (let i = 0; i < playerMax; i++) {
                document.getElementById(`point${i}`).innerText = dbcall.GetSumOfPlayer(sessionID, playerNames[i]);
            }
        }

    }, 1000);


}

function getPoints(shootInNummer, target) {
    if (counttype == 3){
        const firstShootPoints = [20, 18, 16];
        const secondShootPoints = [14, 12, 10];
        const thirdShootPoints = [8, 6, 4];

        if (shootInNummer == 1) {
            return firstShootPoints[target];
        } else if (shootInNummer == 2) {
            return secondShootPoints[target];
        } else if (shootInNummer == 3) {
            return thirdShootPoints[target];
        }
    }
    else if(counttype == 2)
    {
        const firstShootPoints = [20, 16, 12];
        const secondShootPoints = [10, 6, 2];

        if (shootInNummer == 1) {
            return firstShootPoints[target];
        } else if (shootInNummer == 2) {
            return secondShootPoints[target];
        }
    }

}

function InsertUser(){
    document.getElementById("firstname").innerText = user["firstname"];
    document.getElementById("lastname").innerText = user["lastname"];
    document.getElementById("nickname").innerText = user["nickname"];
}

function GetGraph(session) {
    const parkour = dbcall.GetParkourBySession(session);
    const names = dbcall.GetNamesBySessionId(session);
    const obstacles = dbcall.GetObstacleByParkour(parkour);
    const points = names.map(name => dbcall.GetShotsByPlayer(session, name));
    const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'];
        //["rgb(167,32,32)", "rgb(155, 55, 102)", "rgb(33, 102, 102)", "rgb(155, 102, 33)",
        //"rgb(139,134,31)", "rgb(150,196,92)", "rgb(161,105,203)", "rgb(0,0,0)"];


    myChart = new Chart("myChart", {
        type: "line",
        data: {
            labels: [""].concat(obstacles)
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {display: true},
            scales: {
                y: {
                    max: 22,
                    min: 0,
                    ticks: {
                        min: 0,
                        stepSize: 1
                    }
                }
            }
        }

    });
    let scales = myChart.scales;

//Add Datasets
    for (let i = 0; i < names.length; i++) {
        let newDataset = {
            label: names[i],
            data: [0].concat(points[i]),
            borderColor: colors[i],
            fill: false
        }
        myChart.data.datasets.push(newDataset);
        myChart.update();
    }

}

function UpdateGraph(session, playername, points) {
    myChart.data.datasets.find(dataset => dataset.label === playername).data.push(points);
    myChart.update();
}

function UpdateShot(session, playername, obstacle, attempt, circle, points) {
    dbcall.makeShot(session, playername, obstacle, attempt, circle, counttype);
    UpdateGraph(session, playername, points);
}

function GetResults(session) {
    document.getElementById("gameresults").style.display = "block";
    const ctx = document.getElementById('podium');
    let delayed;

    new Chart(ctx, {
        type: 'bar',
        title: {
            display: true,
            text: 'Title text'
        },
        data: {
            labels: dbcall.GetSortedPlayers(session),
            datasets: [{
                label: 'Punkte',
                data: dbcall.GetSortedPoints(session),
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
