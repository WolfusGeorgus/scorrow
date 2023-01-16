const session = 'dhaw2a';
const test = GetObstacleByParkour("Easy Parkour");
const parkour = GetParkourBySession(session);
const names = GetNamesBySessionId(session);
const obstacles = GetObstacleByParkour(parkour); // GetObstaclesBy
const points = [GetShotsByPlayer(session, names[0]), GetShotsByPlayer(session, names[1]),
    GetShotsByPlayer(session, names[2]), GetShotsByPlayer(session, names[3])];
const colors = ["rgb(167,32,32)", "rgb(155, 55, 102)", "rgb(33, 102, 102)", "rgb(155, 102, 33)"];


let myChart = new Chart("myChart", {
    type: "line",
    data: {
        labels: obstacles
    },
    options: {
        legend: {display: false}
    }
});

//Add Datasets
for (i = 0; i < names.length; i++) {
    let newDataset = {
        label: names[i],
        data: points[i],
        borderColor: colors[i],
        fill: false
    }
    myChart.data.datasets.push(newDataset);
    myChart.update();
}
