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
                var temperature = tempupdate.responseText;
                temperatureDisplay.textContent = temperature + ' °C';
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

document.addEventListener('DOMContentLoaded', function() {
    var addProductBtn = document.getElementById('add-product-btn');
    var productIframeContainer = document.getElementById('product-iframe-container');
    var closeIframeBtn = document.getElementById('close-iframe-btn');
    var productIframe = document.getElementById('product-iframe');

    addProductBtn.addEventListener('click', function() {
        productIframeContainer.style.display = 'block';
    });

    closeIframeBtn.addEventListener('click', function() {
        productIframeContainer.style.display = 'none';
    });

    // Funktion zum Hinzufügen des Produkts zur Datenbank
    window.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'addProduct') {
            var product = event.data.product;

            // Sende Produktdaten an den Server
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/add_product', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    alert('Produkt hinzugefügt: ' + product);
                    productIframeContainer.style.display = 'none';
                } else if (xhr.readyState == 4) {
                    alert('Fehler beim Hinzufügen des Produkts');
                }
            };
            xhr.send('product=' + encodeURIComponent(product));
        }
    });
});
