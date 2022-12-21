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
}
let run = true;
function spielStarten() {
    let userPoints = 0;
    let shoot = "";
    let shootInNum = 0;
    let playerNum = 1;
    let blackin = document.getElementById('4'),
        redout = document.getElementById('7'),
        goldin = document.getElementById('10'),
        startButton = document.getElementById('startButton');


        startButton.addEventListener('click', spielRun)

        function spielRun() {
            if(run){
                blackin.addEventListener('click', targetHit);
                redout.addEventListener('click', targetHit);
                goldin.addEventListener('click', targetHit);
                startButton.innerText = "Stop";
                run = false;
            }
            else{
                blackin.removeEventListener('click', targetHit);
                redout.removeEventListener('click', targetHit);
                goldin.removeEventListener('click', targetHit);
                startButton.innerText = "Start";
                run = true;
            }
        }

    function targetHit(event) {
            
        if(shootInNum < 3){
            shootInNum += 1;
            userPoints += parseInt(event.target.id);
            shoot += "X";
            document.getElementById(`point${playerNum}`).innerText = userPoints;
            document.getElementById(`hit${playerNum}`).innerText = shoot;
        }
        else {
            alert('You reached the limit! Next player...');
            playerNum += 1;
            shootInNum = 0;
            userPoints = 0;
            shoot = "";
        }

        $("#canvas").click(function(e){
            getPosition(e);
        });


        function getPosition(event){
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;

            drawCoordinates(x,y);
        }
    }
}
//var result = GetAllObstacles();
//for (var key in result) {
//    document.getElementById("testing").innerHTML += key + ": " + result[key] + "<br>";
//}

//RED DOT

function drawCoordinates(x,y){
    var ctx = document.getElementById("canvas").getContext("2d");
    var pointSize = 3;

    ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}