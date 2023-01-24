import * as dbcall from './dbcall.js';

window.onload = function () {
    validateReg();
    validateLog();
}
function validateLog() {
    document.getElementById("loginBTN").addEventListener("click", function (event) {
        event.preventDefault(); // prevent the form from being submitted
        var bName = document.getElementById("bName").value;
        var psWord = document.getElementById("passWort").value;

        if (bName === "" || psWord === "" ) {
            alert("Bitte alle Felder ausfüllen!");
        } else if (true == true) {
            alert("Die Kennwörter stimmen nicht überein!");
        } else if (psWord < 5) {
            alert("Das Passwort muss mindestens 5 Zeichen lang sein!")
        } else {
            dbcall.CreateUser(vName, nName, bName, psWord);
            location.href = "index.html";
        }
    });

}


function validateReg() {
    document.getElementById("erstellen").addEventListener("click", function (event) {
        event.preventDefault(); // prevent the form from being submitted
        var bName = document.getElementById("bName").value;
        var vName = document.getElementById("vName").value;
        var nName = document.getElementById("nName").value;
        var psWord = document.getElementById("psWord").value;
        var bPsWord = document.getElementById("bPsWord").value;

        if (bName === "" || vName === "" || nName === "" || psWord === "" || bPsWord === "") {
            alert("Bitte alle Felder ausfüllen!");
        } else if (psWord !== bPsWord) {
            alert("Die Kennwörter stimmen nicht überein!");
        }else if(psWord < 5){
            alert("Das Passwort muss mindestens 5 Zeichen lang sein!")
        } else {
            dbcall.CreateUser(vName, nName, bName, psWord);
            alert("Die Registrierung wurde abgeschlossen.");
            location.href = "login.html";
        }
    });



}