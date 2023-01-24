import * as dbcall from './dbcall.js';

window.onload = function () {
    validateReg();
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
        }else if(psWord < 10){
            alert("Password")
        } else {
            dbcall.CreateUser(vName, nName, bName, psWord);
            alert("Die Registrierung wurde abgeschlossen.");
            location.href = "login.html";
        }
    });
}