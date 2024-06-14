

//////////////////////////////////
/////Temperatur ANFANG
//////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    var temperatureDisplay = document.getElementById('current-temp');

    // Funktion zum Aktualisieren der Temperaturanzeige
    function updateTemperature() {
        // AJAX-Anfrage, um die Temperatur abzurufen
        var tempupdate = new XMLHttpRequest();
        tempupdate.open('GET', 'http://localhost:8000/get_temperature', true);
        tempupdate.onreadystatechange = function() {
            if (tempupdate.readyState == 4 && tempupdate.status == 200) {
                var temptest = JSON.parse(tempupdate.responseText)[0]
                temperatureDisplay.textContent = temptest + ' °C';
            }
        };
        tempupdate.send();
    }

    // Temperatur wird einmalig geladen beim Aufruf der HTML und jede Sekunde aktualisiert
    updateTemperature();
    setInterval(updateTemperature, 1000);
});

/////////////////////////////////////
/////Temperatur ENDE
/////////////////////////////////////

/////////////////////////////////////
/////Uhrzeit | ANFANG
/////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    // Funktion zur Aktualisierung der Uhrzeit
    function updateTime() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        // Wenn Zahlen kleiner als < 10, wird eine 0 davor gestellt, das passiert bei Stunden, Minuten, Sekunden
        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        // Uhrzeitformat 00:00:00
        var timeString = hours + ":" + minutes + ":" + seconds;

        // Uhrzeit in die HTML einfügen
        var currentTimeElement = document.getElementById('current-time');
        currentTimeElement.textContent = timeString;

        // Uhrzeit alle 1 Sekunde aktualisieren
        setTimeout(updateTime, 1000);
    }

    // Initiale Aktualisierung der Uhrzeit
    updateTime();
});

//////////////////////////////////////
/////Uhrzeit | ENDE
//////////////////////////////////////

//////////////////////////////////////
/////Produkt hinzufügen Popup
//////////////////////////////////////

