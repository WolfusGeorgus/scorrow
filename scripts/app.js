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

function validateForm(ev){
    let parkourName = document.getElementById("parkour-input").value;
    if (!CheckParkourName(parkourName)){
        let obstacles = $("#select option:selected").map(function () {
            return this.value;
        }).get();
        CreateParkour(parkourName, obstacles);
    }
    else{
        ev.preventDefault();
        alert("Parkour Name already used");
    }

}

window.onload = function() {
    document.addEventListener("submit", validateForm);
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

/*---------------Game-----------------------
--------------------------------------------- */
let run = true;
let userPoints = 0;
let shoot = "";
let shootInNum = 1;
let playerNum = 1;
let point = 0;
let hit = true;
let blue = document.getElementById('blue'),
    red = document.getElementById('red'),
    gold = document.getElementById('gold'),
    targetBoard = document.getElementById('targetBoard'),
startButton = document.getElementById('startButton');

function spielStarten() {
    startButton.addEventListener('click', spielRun)
}

function spielRun() {
    if(run){
        blue.addEventListener('click', targetHit);
        red.addEventListener('click', targetHit);
        gold.addEventListener('click', targetHit);
        targetBoard.addEventListener('click',targetHit);
        startButton.innerText = "Stop";
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

    switch (event.target.id) {
        case 'blue':
            point = getPoints(shootInNum,2);
            document.getElementById(`point${playerNum}`).innerText = point;
            playerNum++;
            event.stopImmediatePropagation();
            break;
        case 'red':
            point = getPoints(shootInNum,1);
            document.getElementById(`point${playerNum}`).innerText = point;
            playerNum++;
            event.stopImmediatePropagation();
            break;
        case 'gold':
            point = getPoints(shootInNum,0);
            document.getElementById(`point${playerNum}`).innerText = point;
            playerNum++;
            event.stopImmediatePropagation();
            break;
        case 'targetBoard':
            point = 0;
            if(shootInNum == 3){
                playerNum++;
                event.stopImmediatePropagation();
                shootInNum = 0;
                event.stopImmediatePropagation();
                break;
            }
            shootInNum++;
            hit = false;
            shoot += "X";
            document.getElementById(`hit${playerNum}`).innerText = shoot;
            event.stopImmediatePropagation();
            break;
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