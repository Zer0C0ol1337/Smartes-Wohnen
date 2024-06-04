//////////////////////////////////
/////Temperatur ANFANG
//////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    var temperatureDisplay = document.getElementById('current-temp');

    // Funktion zum Aktualisieren der Temperaturanzeige
    function updateTemperature() {
        // AJAX-Anfrage, um die Temperatur abzurufen
        var tempupdate = new XMLHttpRequest();
        tempupdate.open('GET', '/get_temperature', true); // AJAX-Anfrage an den Server
        tempupdate.onreadystatechange = function() {
            if (tempupdate.readyState == 4 && tempupdate.status == 200) {
                var temperature = tempupdate.responseText;
                temperatureDisplay.textContent = temperature + ' °C'; // Temperatur in das HTML-Element einfügen
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
///TESTBEREICH


document.addEventListener('DOMContentLoaded', function() {
    var downloadPdfBtn = document.getElementById('download-pdf-btn');

    // Funktion zum Öffnen der PDF in einem Popup-Fenster
    function showPdfPopup() {
        var pdfUrl = 'https://object.storage.eu01.onstackit.cloud/leaflets/pdfs/84618f1c-1282-11ef-ab69-fa163fa6f8af/Prospekt-23-05-2024-29-05-2024-01.pdf'; // Pfad zur PDF-Datei
        var pdfWindow = window.open(pdfUrl, '_blank', 'width=800,height=600');
        
        if (!pdfWindow || pdfWindow.closed || typeof pdfWindow.closed == 'undefined') {
            alert('Bitte deaktiviere deinen Popup-Blocker und versuche es erneut.');
        }
    }

    // Eventlistener für den Download-Button
    downloadPdfBtn.addEventListener('click', function() {
        showPdfPopup(); // Funktion zum Öffnen der PDF aufrufen
    });
});
