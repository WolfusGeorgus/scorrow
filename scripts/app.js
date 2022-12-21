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
    let blackin = document.getElementById('16'),
        redout = document.getElementById('18'),
        goldin = document.getElementById('20'),
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
    }
}
//var result = GetAllObstacles();
//for (var key in result) {
//    document.getElementById("testing").innerHTML += key + ": " + result[key] + "<br>";
//}
