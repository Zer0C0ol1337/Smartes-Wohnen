//////////////////////////////////
/////Temperatur ANFANG
//////////////////////////////////

const temperatureDisplay = document.getElementById('current-temp');

async function updateTemperature() {
    try {
        const response = await fetch('http://192.168.178.22:8000/get_temperature');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            console.log('Received data:', data);
            if (data && data.temperature && data.temperature.temperature) {
                temperatureDisplay.textContent = `${data.temperature.temperature} °C`;
            } else {
                console.error('Unexpected response format:', data);
            }
        }
    } catch (error) {
        console.error('Error with request:', JSON.stringify(error, null, 2));
    }
}

updateTemperature();
setInterval(updateTemperature, 60000);

/////////////////////////////////////
/////Temperatur ENDE
/////////////////////////////////////

/////////////////////////////////////
/////Uhrzeit | ANFANG
/////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const currentTime = new Date();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();

        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        const timeString = `${hours}:${minutes}:${seconds}`;

        const currentTimeElement = document.getElementById('current-time');
        currentTimeElement.textContent = timeString;

        setTimeout(updateTime, 1000);
    }

    updateTime();
});

//////////////////////////////////////
/////Uhrzeit | ENDE
//////////////////////////////////////

//////////////////////////////////////
/////Produkt hinzufügen Popup | ANFANG
//////////////////////////////////////

const products = [
    {name: 'Milch', icon: '/icons/milk.png'},
    {name: 'Eier', icon: '/icons/egg.png'},
    {name: 'Cola', icon: '/icons/cola.png'}, // Korrigiert: 'Cola.png' zu 'cola.png'
    {name: 'Jogurt', icon: '/icons/yogurt.png'},
];

const productList = document.getElementById('product-list');
productList.style.listStyleType = 'none';

products.forEach(function(product, index) {
    const listItem = document.createElement('li');
    const img = document.createElement('img');
    img.src = product.icon;
    img.alt = product.name;
    img.style.width = '50px';
    img.style.height = '50px';
    listItem.appendChild(img);

    const productName = document.createElement('span');
    productName.textContent = product.name;
    productName.style.marginRight = '10px';
    listItem.appendChild(productName);

    listItem.addEventListener('click', function() {
        selectedProduct = index;

        const allIcons = document.querySelectorAll('#product-list img');
        allIcons.forEach(function(icon) {
            icon.classList.remove('highlighted');
        });

        img.classList.add('highlighted');
    });

    productList.appendChild(listItem);
});

document.getElementById('add-product-btn').addEventListener('click', function() {
    document.getElementById('product-popup').style.display = 'block';
});

window.addEventListener('click', function(event) {
    const popup = document.getElementById('product-popup');
    if (event.target == popup) {
        popup.style.display = 'none';
    }
});

let selectedProduct = null;

const closePopupBtn = document.getElementById('close-popup-btn');

closePopupBtn.addEventListener('click', function() {
    document.getElementById('product-popup').style.display = 'none';
});

//////////////////////////////////////
/////Produkt hinzufügen Popup | ENDE
//////////////////////////////////////

//////////////////////////////////////
/////SQL INJECTION | ANFANG     /////
//////////////////////////////////////

document.getElementById('add-to-cart-btn').addEventListener('click', async function() {
    if (selectedProduct !== null) {
        const quantityInput = document.getElementById('quantity');
        const productData = {
            product_name: products[selectedProduct].name,
            quantity: quantityInput.value,
        };
        try {
            const response = await fetch('http://192.168.178.22:8000/add_product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                alert(`Produkt ${products[selectedProduct].name} wurde mit der Menge ${quantityInput.value} dem Kühlschrank hinzugefügt.`);
            }
        } catch (error) {
            console.error('Request failed', error);
        }
        selectedProduct = null;
        const allIcons = document.querySelectorAll('#product-list img');
        allIcons.forEach(function(icon) {
            icon.classList.remove('highlighted');
        });
    }
});

////////////////////////////////////// 
/////SQL INJECTION | ENDE     /////
//////////////////////////////////////

////////////////////////////////////// 
/////PDFreader | ANFANG     /////
//////////////////////////////////////


var btn = document.getElementById("pdfbtn");

var modal = document.getElementById('pdfreader');

var object = document.getElementById('pdfObject');

btn.onclick = function() {
  var pdfVersion = 'DE_de_KDZ_6100_D25';  

  var url = 'https://leaflets.kaufland.com/de-DE/' + pdfVersion + '/ar/6100';

  object.data = url;

  modal.style.display = "block";
}

var span = document.getElementsByClassName("close")[0];

// Wenn der Benutzer auf <span> (x) klickt, schließt sich das Modal
span.onclick = function() {
  modal.style.display = "none"; // Korrigiert: 'pdfreader' zu 'modal'
}

///////////////////////////////////////
// REZEPTE ANFANG/////////////////
///////////////////////////////////////

var box = document.querySelector('.recipes');
var popup = document.querySelector('#recipes-popup');

box.onclick = function() {
    popup.style.display = "block";
}

var closeBtn = document.querySelector('#close-recipes-popup-btn');

closeBtn.onclick = function() {
    popup.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

var recipes = ["Spaghetti mit Tomatensoße"];

var recipesList = document.querySelector('#recipes-list');
var recipesPopup = document.querySelector('#recipes-popup');

recipesPopup.style.height = (recipes.length * 200) + 'px';

for (var i = 0; i < recipes.length; i++) {
    var listItem = document.createElement('li');

    listItem.textContent = recipes[i];

    listItem.addEventListener('click', function() {
        var recipe = this.textContent;
        fetch(`/checkIngredients/${recipe}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Fehler:', data.error);
                } else if (data.status === 'rot') {
                    alert('Fehlende Zutaten: ' + data.missing_ingredients.join(', '));
                } else {
                    alert('Alle Produkte sind vorrätig');
                }
            })
            .catch((error) => {
                console.error('Fehler:', error);
            });
    });

    recipesList.appendChild(listItem);
}

///////////////////////////////////////
// REZEPTE ENDE/////////////////
///////////////////////////////////////


///////////////////////////////////////
// Produkt Entfernen ANFANG////////////
///////////////////////////////////////


    const removeProductBtn = document.getElementById('remove-product-btn');
    if (removeProductBtn) {
        removeProductBtn.addEventListener('click', function() {
            document.getElementById('remove-product-popup').style.display = 'block';
            fetchProducts();
        });
    }

    const closeRemovePopupBtn = document.getElementById('close-remove-popup-btn');
    if (closeRemovePopupBtn) {
        closeRemovePopupBtn.addEventListener('click', function() {
            document.getElementById('remove-product-popup').style.display = 'none';
        });
    }
///////////////////////////////////////
// Produkt Entfernen ENDE//////////////
///////////////////////////////////////