import * as dbcall from './dbcall.js';

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("#teilnehmerTable td:last-child").html();
    // Append table with add row form on add new button click
    $(".add-new").click(function(){
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
    $(document).on("click", ".add", function(){
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Edit row on edit button click
    $(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
    });
    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        $(this).tooltip('dispose');
    });
});

function validateParkourForm(ev){
    let parkourName = document.getElementById("parkour-input").value;
    let location = document.getElementById("parkourOrt-input").value;
    if (!CheckParkourName(parkourName)){
        let obstacles = $("#select option:selected").map(function () {
            return this.value;
        }).get();
        CreateParkour(parkourName, location, obstacles);
    }
    else{
        ev.preventDefault();
        alert("Parkour Name already used");
    }

}

let sessionId = 0;

function validateSessionForm(ev){
    let parkour = document.getElementById("parkourDropdown");
    let parkourName = parkour.options[parkour.selectedIndex].text;
    sessionId = document.getElementById("sessionId").value;
    var table = document.getElementById('teilnehmerTable');
    const listOfMembers = [];
    for (var r = 1, n = table.rows.length; r < n; r++) {
        const listOfNames = [];
        for (var c = 0, m = table.rows[r].cells.length; c < m - 1; c++) {
            listOfNames[c] = table.rows[r].cells[c].innerHTML;
        }

        listOfMembers[r-1] = listOfNames;
    }

    let session = CreateSession(sessionId, parkourName, listOfMembers);
    document.getElementById("sessionId").value = Math.random().toString(36).slice(2).substring(5);
}

$("#spielStartenModalButton").click(function() {
    $('#createSessionSuccessModal').modal('hide');
    $('html, body').animate({
        scrollTop: $("#spiel").offset().top
    }, 200);
});

window.onload = function() {
    var submitParkour = document.getElementById("parkourAnlegenBTN");
    var submitSession = document.getElementById("sessionAnlegenBTN");
    submitParkour.addEventListener("click", validateParkourForm);
    submitSession.addEventListener("click", validateSessionForm);
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
    spielStarten();

    //Add parkours to create session part

    var parkours = GetParkours();
    let i = 0;
    for(key in parkours){
        if (i = 0){
            document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "' selected>"+ parkours[key] + "</option>";
        }else{
            document.getElementById("parkourDropdown").innerHTML += "<br><option id=" + key + " value='" + key + "'>"+ parkours[key] + "</option>";
        }
    }

    var sessionId =  Math.random().toString(36).slice(2).substring(5);
    document.getElementById("sessionId").value = sessionId;
}

/*---------------Game-----------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
let run = true;
let userPoints = 0;
let shoot = "";
let shootInNum = 1;
let playerNum = 1;
let playerMax;
let point = 0;
let hit = true;
let sessionId = 0;
let obstacleNum = 1;

let blue = document.getElementById('blue'),
    red = document.getElementById('red'),
    gold = document.getElementById('gold'),
    targetBoard = document.getElementById('targetBoard'),
startButton = document.getElementById('startButton'),
    obstacles,
    playerNames;

function spielStarten() {
    startButton.addEventListener('click', spielRun)
    obstacles = dbcall.GetObstacleByParkour();
    playerNames = dbcall.GetNamesBySessionId();
    playerMax = playerNames.length;
}

function spielRun() {
    if(run){
        blue.addEventListener('click', targetHit);
        red.addEventListener('click', targetHit);
        gold.addEventListener('click', targetHit);
        targetBoard.addEventListener('click',targetHit);
        document.getElementById(`animal`).innerText = obstacles[obstacleNum];
        document.getElementById(`spielerName`).innerText = playerNames[playerNum];

        for(let i = 0; i <= playerMax; i++){
            var row = '<tr>' +
                '<td>'+ `${playerNames[i]}`+'</td>\n' +
                '<td id='+ `hit${playerNum}`+'></td>\n' +
                '<td id='+`point${playerNum}`+'>0</td>' +
                '</tr>';

            $("#scoreBoard").append(row);
        }
        startButton.innerText = "Pause";
        run = false;
    }
    else{
        blue.removeEventListener('click', targetHit);
        red.removeEventListener('click', targetHit);
        gold.removeEventListener('click', targetHit);
        targetBoard.removeEventListener('click',targetHit)
        startButton.innerText = "Start";
        run = true;
    }
}
function targetHit(event) {

    if(playerMax >= playerNum) {
        switch (event.target.id) {
            case 'blue':
                point = getPoints(shootInNum, 2);
                document.getElementById(`point${playerNum}`).innerText = point;
                playerNum++;
                shootInNum = 1;
                shoot = "";
                document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                dbcall.makeShot(sessionId, playerNames[playerNum], obstacles[obstacleNum], shootInNum, 3)
                event.stopImmediatePropagation();
                break;
            case 'red':
                point = getPoints(shootInNum, 1);
                document.getElementById(`point${playerNum}`).innerText = point;
                playerNum++;
                shootInNum = 1;
                shoot = "";
                document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                dbcall.makeShot(sessionId, playerNames[playerNum], obstacles[obstacleNum], shootInNum, 2)
                event.stopImmediatePropagation();
                break;
            case 'gold':
                point = getPoints(shootInNum, 0);
                document.getElementById(`point${playerNum}`).innerText = point;
                playerNum++;
                shootInNum = 1;
                shoot = "";
                document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                dbcall.makeShot(sessionId, playerNames[playerNum], obstacles[obstacleNum], shootInNum, 1)
                event.stopImmediatePropagation();
                break;
            case 'targetBoard':
                point = 0;
                shoot += "X";
                if (shootInNum == 3) {
                    dbcall.makeShot(sessionId, playerNames[playerNum], obstacles[obstacleNum], shootInNum, 0)
                    document.getElementById(`hit${playerNum}`).innerText = shoot;
                    playerNum++;
                    shoot = "";
                    shootInNum = 1;
                    document.getElementById(`spielerName`).innerText = playerNames[playerNum];
                    event.stopImmediatePropagation();
                    break;
                }
                shootInNum++;
                hit = false;
                document.getElementById(`hit${playerNum}`).innerText = shoot;
                event.stopImmediatePropagation();
                break;
        }
    }
    else if(obstacleNum <= obstacles.length){
        obstacleNum++;
        document.getElementById(`animal`).innerText = obstacles[obstacleNum];
        playerNum = 1;
        shoot = "";
        for(let i = 1; i <= playerMax; i++){
            document.getElementById(`hit${i}`).innerText = shoot;
        }
    }
    else if (obstacleNum > obstacles.length){
        //Spiel Ende!! TODO
    }
}

function getPoints(shootInNummer, target){
    const firstShootPoints = [20,18,16];
    const secondShootPoints = [14,12,10];
    const thirdShootPoints = [8,6,4];

    if(shootInNummer == 1){
        return firstShootPoints[target];
    }
    else if(shootInNummer == 2){
        return secondShootPoints[target];
    }
    else if(shootInNummer == 3){
        return  thirdShootPoints[target];
    }
}