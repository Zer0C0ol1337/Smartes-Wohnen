/// File für die Steuerung der Button Popups etc.
// Popup-Funktionen
document.addEventListener('DOMContentLoaded', function() {
    var popupBtn1 = document.getElementById('popup-btn-1');
    var popupBtn2 = document.getElementById('popup-btn-2');
    var popupBtn3 = document.getElementById('popup-btn-3');

    function openPopup(popupContent) {
        alert(popupContent); // Hier könntest du auch eine benutzerdefinierte Popup-Box verwenden
    }

    popupBtn1.addEventListener('click', function() {
        openPopup('Popup 1 Inhalt');
    });

    popupBtn2.addEventListener('click', function() {
        openPopup('Popup 2 Inhalt');
    });

    popupBtn3.addEventListener('click', function() {
        openPopup('Popup 3 Inhalt');
    });
});